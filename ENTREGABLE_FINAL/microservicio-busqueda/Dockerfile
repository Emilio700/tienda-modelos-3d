FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar código fuente
COPY server.js ./

# Exponer puerto
EXPOSE 3001

# Comando para iniciar
CMD ["node", "server.js"]
