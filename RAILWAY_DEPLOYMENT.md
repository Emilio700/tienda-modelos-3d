# Railway Backend Deployment Guide

## 📋 Archivos Creados para Railway

- ✅ `railway.json` - Configuración de Railway
- ✅ `server.js` - Actualizado con CORS configurado para Vercel

## 🚀 Pasos para Desplegar Backend en Railway

### Paso 1: Subir Cambios a GitHub

Primero, sube los cambios al repositorio:

```bash
cd "c:\Users\aksel\OneDrive\Documentos\PYANSA TI\Indicadores\WEB"
git add .
git commit -m "Configuración del backend para Railway"
git push origin master
```

### Paso 2: Crear Cuenta en Railway

1. Ve a: **[railway.app](https://railway.app)**
2. Haz clic en **"Start a New Project"** o **"Login with GitHub"**
3. Autoriza Railway para acceder a tu repositorio de GitHub

### Paso 3: Crear Nuevo Proyecto

1. En el dashboard de Railway, haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona: **`Emilio700/tienda-modelos-3d`**
4. Railway detectará automáticamente que es un proyecto Node.js

### Paso 4: Configurar el Proyecto

1. Railway te preguntará qué servicio desplegar
2. Selecciona la carpeta **`backend`** como Root Directory
3. Railway auto-detectará:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: 5000

### Paso 5: Configurar Variables de Entorno (Opcional pero Recomendado)

En el dashboard de Railway:
1. Ve a tu proyecto → **Variables**
2. Agrega las siguientes variables:

```
JWT_SECRET=tu-secret-key-super-seguro-cambiar-esto-123456
PORT=5000
```

### Paso 6: Desplegar

1. Haz clic en **"Deploy"**
2. Railway comenzará a construir y desplegar tu backend
3. Espera 1-2 minutos

### Paso 7: Obtener URL del Backend

1. Una vez desplegado, Railway te dará una URL como:
   - `https://tu-proyecto.up.railway.app`
2. **Copia esta URL** - la necesitarás para el frontend

### Paso 8: Probar el Backend

Abre en tu navegador:
```
https://tu-proyecto.up.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "Servidor funcionando correctamente"
}
```

## 🔗 Conectar Frontend con Backend

Una vez que tengas la URL de Railway, actualiza tu frontend en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   ```
   VITE_API_URL=https://tu-proyecto.up.railway.app
   ```
4. Redespliega el frontend

## ✅ Verificación Final

Prueba que funcione:
1. Abre tu app en Vercel: `https://tienda-modelos-3d.vercel.app`
2. Intenta **registrarte** o **hacer login**
3. Verifica que la autenticación funcione
4. Prueba hacer una **compra** y verifica que se guarde

## 🎉 ¡Listo!

Tu aplicación ahora está completamente desplegada con:
- ✅ **Frontend en Vercel**
- ✅ **Backend en Railway**
- ✅ **Base de datos JSON en Railway** (persistente)
- ✅ **Autenticación JWT funcionando**
