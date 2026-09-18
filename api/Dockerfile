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

# Antes de arrancar: aplica migraciones pendientes contra la BD de producción y
# siembra el catálogo de roles/permisos + el usuario administrador por defecto
# si aún no existe ninguno. Ambos pasos son seguros de re-ejecutar en cada deploy
# (migrate deploy no reaplica migraciones ya aplicadas; el seed usa upsert y solo
# crea el admin cuando no hay ninguno).
CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed && npm run start"]
