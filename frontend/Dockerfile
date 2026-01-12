# Dockerfile para Frontend (Vite)
FROM node:18-alpine

WORKDIR /app

# Copiar dependencies
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Iniciar en modo desarrollo con host expuesto
CMD ["npm", "run", "dev", "--", "--host"]
