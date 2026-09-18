# /frontend/Dockerfile
# Etapa 1: Compilación de React/Vite
FROM node:18-alpine AS build

WORKDIR /app

# Recibimos variables de entorno en tiempo de build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
# Construimos el bundle de producción
RUN npm run build

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine

# Copiamos los archivos estáticos desde la etapa de compilación
COPY --from=build /app/dist /usr/share/nginx/html

# Configuramos Nginx para que soporte React Router (Single Page Application)
RUN echo "server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files \$uri \$uri/ /index.html; \
    } \
    }" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
