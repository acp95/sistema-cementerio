# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar la aplicación para producción
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados desde el stage anterior
# Nota: La ruta puede variar según la versión de Angular (dist/frontend/browser o dist/frontend)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
