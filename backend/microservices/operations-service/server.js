import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.OPERATIONS_SERVICE_PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-for-3d-models-store-123';

// Rutas de archivos de datos (dentro del contenedor Docker)
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Middleware
// CORS disabled - handled by API Gateway
app.use(express.json());

// Funciones helper para leer/escribir datos
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
  }
}

async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
}

async function writeOrders(orders) {
  try {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error writing orders:', error);
  }
}

// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'operations-service'
  });
});

// ========== RUTAS DE AUTENTICACIÓN ==========

// POST /auth/register - Registrar nuevo usuario
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const users = await readUsers();

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // En producción, esto debería estar hasheado
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeUsers(users);

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Devolver usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/login - Iniciar sesión
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const users = await readUsers();

    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Devolver usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /auth/me - Obtener información del usuario actual
app.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error en /me:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ========== RUTAS DE PEDIDOS ==========

// GET /users/:userId/orders - Obtener pedidos de un usuario
app.get('/users/:userId/orders', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar que el usuario solo puede acceder a sus propios pedidos
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const orders = await readOrders();
    const userOrders = orders.filter(order => order.userId === userId);

    res.json({ orders: userOrders });
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /users/:userId/orders - Crear nuevo pedido
app.post('/users/:userId/orders', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const orderData = req.body;

    // Verificar que el usuario solo puede crear pedidos para sí mismo
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const orders = await readOrders();

    // Crear nuevo pedido con userId
    const newOrder = {
      ...orderData,
      userId,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString()
    };

    orders.push(newOrder);
    await writeOrders(orders);

    res.status(201).json({ order: newOrder });
  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`👤 Operations Service running on port ${PORT}`);
  console.log(`🔐 Usuarios de prueba:`);
  console.log(`   -  Aksell Emilio Cornejo Carmona / user1@demo.com / pass123`);
  console.log(`   - Giovanni Adair Avilés García / user2@demo.com / pass123`);
  console.log(`   - Yimy Enrique Huaman Quispe / user3@demo.com / pass123`);
  console.log(`   - Nicolas Reyes Meza / user4@demo.com / pass123`);
});
