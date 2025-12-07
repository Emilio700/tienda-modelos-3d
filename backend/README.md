# Backend - Sistema de Autenticación

Backend API para la tienda de modelos 3D con autenticación JWT.

## 🚀 Inicio Rápido

### Instalar dependencias
```bash
npm install
```

### Ejecutar el servidor
```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5000`

## 📋 Endpoints Disponibles

### Autenticación

#### POST /api/auth/register
Registrar un nuevo usuario.

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "mipassword"
}
```

**Response:**
```json
{
  "user": { "id": "...", "name": "...", "email": "..." },
  "token": "JWT_TOKEN"
}
```

#### POST /api/auth/login
Iniciar sesión.

**Body:**
```json
{
  "email": "user1@demo.com",
  "password": "pass123"
}
```

**Response:**
```json
{
  "user": { "id": "...", "name": "...", "email": "..." },
  "token": "JWT_TOKEN"
}
```

#### GET /api/auth/me
Obtener información del usuario actual (requiere token).

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

### Pedidos

#### GET /api/auth/users/:userId/orders
Obtener pedidos de un usuario (requiere token).

#### POST /api/auth/users/:userId/orders
Crear un nuevo pedido (requiere token).

## 👥 Usuarios de Prueba

- **user1@demo.com** / pass123 (Juan Pérez)
- **user2@demo.com** / pass123 (María García)
- **user3@demo.com** / pass123 (Carlos López)
- **user4@demo.com** / pass123 (Ana Martínez)
- **user5@demo.com** / pass123 (Pedro Sánchez)

## 📁 Estructura de Archivos

- `server.js` - Servidor Express principal
- `data/users.json` - Base de datos de usuarios
- `data/orders.json` - Base de datos de pedidos
- `.env` - Variables de entorno

## 🔧 Variables de Entorno

- `PORT` - Puerto del servidor (default: 5000)
- `JWT_SECRET` - Clave secreta para JWT
- `FRONTEND_URL` - URL del frontend para CORS (default: http://localhost:5173)
