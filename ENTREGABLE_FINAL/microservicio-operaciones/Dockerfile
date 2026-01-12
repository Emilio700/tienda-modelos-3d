FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar código fuente
COPY server.js ./

# Crear directorio para datos
RUN mkdir -p /app/data

# Exponer puerto
EXPOSE 3002

# Comando para iniciar
CMD ["node", "server.js"]
