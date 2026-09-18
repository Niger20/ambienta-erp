# /api/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copiamos primero dependencias para aprovechar la caché de Docker
COPY package*.json ./
COPY prisma ./prisma/

# Instalamos dependencias optimizado para entornos de CI/CD (evita ECONNRESET)
RUN npm config set maxsockets 3 && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci

# Copiamos el resto del código del backend
COPY . .

# Construimos el backend (si usas TypeScript)
RUN npm run build

EXPOSE 3000

# El comando final lo delegaremos al docker-compose para que 
# ejecute Prisma ANTES de iniciar el servidor Node.
CMD ["npm", "run", "start"]
