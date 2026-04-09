# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar la aplicación
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Copiar solo lo necesario desde el build
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Exponer el puerto del backend (por defecto NestJS usa 3000)
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start:prod"]
