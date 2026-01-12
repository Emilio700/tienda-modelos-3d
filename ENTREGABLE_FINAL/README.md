# 🎨 Tienda de Modelos 3D con Autenticación

Sistema completo de e-commerce para modelos 3D con autenticación de usuarios, gestión de pedidos y devoluciones.

## 🏗️ Estructura del Proyecto

```
WEB/
├── backend/          # API con autenticación JWT
│   ├── server.js
│   ├── data/
│   │   ├── users.json
│   │   └── orders.json
│   └── package.json
└── frontend/         # React con Vite
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── hooks/
    │   └── styles/
    └── package.json
```

## 🚀 Instalación y Ejecución

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

El servidor backend se ejecutará en `http://localhost:5000`

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecutará en `http://localhost:5173`

## 👥 Usuarios de Prueba

Puedes usar estos usuarios para probar el sistema:

- `user1@demo.com` / `pass123`
- `user2@demo.com` / `pass123`
- `user3@demo.com` / `pass123`
- `user4@demo.com` / `pass123`
- `user5@demo.com` / `pass123`

## ✨ Funcionalidades

### Autenticación
- ✅ Registro de usuarios
- ✅ Login/Logout
- ✅ Protección de rutas (checkout y orders requieren login)
- ✅ Gestión de sesión con JWT

### E-commerce
- ✅ Catálogo de productos 3D
- ✅ Búsqueda y filtrado
- ✅ Carrito de compras
- ✅ Proceso de checkout
- ✅ Historial de pedidos por usuario
- ✅ Sistema de devoluciones

### Tecnologías

**Backend:**
- Node.js + Express
- JWT para autenticación
- CORS habilitado
- Almacenamiento en JSON

**Frontend:**
- React 19
- React Router v7
- Custom Hooks (useAuth, useCart, useSearch, useLocalStorage)
- CSS con metodología BEM
- Diseño responsivo

## 📖 Flujo de Uso

1. **Navegar** por el catálogo de productos
2. **Agregar** productos al carrito
3. **Login/Registro** al intentar hacer checkout
4. **Completar** información de envío
5. **Ver pedidos** en "Mis Pedidos"
6. **Solicitar devoluciones** si es necesario

## 🔐 Seguridad

- Contraseñas almacenadas en texto plano (solo para demo)
- Tokens JWT con expiración de 7 días
- Validación de tokens en endpoints protegidos
- Usuarios solo pueden acceder a sus propios pedidos

**Nota:** Este es un proyecto de demostración. En producción se deben implementar medidas de seguridad adicionales.
