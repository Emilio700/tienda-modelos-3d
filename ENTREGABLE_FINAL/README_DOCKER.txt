GUÍA RÁPIDA: CÓMO LEVANTAR EL PROYECTO CON DOCKER 🐳

Antes de empezar:
Asegúrate de tener Docker Desktop instalado y corriendo.

PASO 1: Iniciar Todo
--------------------
1. Abre una terminal en la carpeta 'backend' de este proyecto.
2. Ejecuta el siguiente comando:
   
   docker-compose up --build

   (Este comando construirá las imágenes del Backend y Frontend, descargará Elasticsearch y levantará todo)

PASO 2: Verificar que todo funciona
-----------------------------------
Una vez que veas logs indicando que los servicios iniciaron:

*   Frontend (Tienda):  http://localhost:5173
*   Backend API (Gw):   http://localhost:8080
*   Elasticsearch:      http://localhost:9200

PASO 3: Poblar la Base de Datos (Solo la primera vez)
-----------------------------------------------------
Si Elasticsearch está vacío (recién instalado), necesitas cargar los productos.
Mantén la terminal de Docker abierta, abre una NUEVA terminal en la carpeta 'backend' y ejecuta:

   npm run seed-es

Esto conectará con el Elasticsearch de Docker y cargará los 15 productos de prueba.

PASO 4: Probando la App
-----------------------
1. Ve a http://localhost:5173
2. Inicia sesión con usuarios de prueba:
   - user1@demo.com / pass123
   - user2@demo.com / pass123
   - user3@demo.com / pass123
   - user4@demo.com / pass123
3. ¡Disfruta! El carrito y wishlist son independientes por usuario.

-----------------------------------------------------
SOLUCIÓN DE PROBLEMAS
-----------------------------------------------------
- Si falla el seed: Asegúrate de que Elasticsearch esté "green" o "yellow" (ver logs de Docker).
- Si el login falla: Asegúrate de que el backend (operations-service) haya iniciado correctamente en el puerto 3002 (interno) o 8080 (externo).
