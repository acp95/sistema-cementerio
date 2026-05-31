# Guía de Despliegue en Railway (Nativo / Sin Docker)

Este proyecto está preparado para ser desplegado fácilmente en **Railway** (https://railway.app/) de forma nativa utilizando Nixpacks (el sistema de construcción automático de Railway). **No se necesita Docker.**

El proyecto consta de 3 servicios principales que se deben configurar:
1. **Base de Datos:** PostgreSQL
2. **Backend:** NestJS
3. **Frontend:** Angular

A continuación, se detallan los pasos exactos para subir todo el proyecto desde tu repositorio de GitHub a Railway.

## 1. Crear el Proyecto y la Base de Datos
1. Inicia sesión en [Railway](https://railway.app/).
2. Haz clic en **"New Project"** (Nuevo Proyecto).
3. Selecciona **"Provision PostgreSQL"** (Provisionar PostgreSQL).
4. Espera a que la base de datos se cree. Una vez creada, haz clic en el servicio de PostgreSQL, ve a la pestaña **Variables** y busca la variable llamada `DATABASE_URL`. La necesitarás para el backend.

## 2. Desplegar el Backend (NestJS)
1. En tu proyecto de Railway, haz clic en **"New"** (Nuevo) -> **"GitHub Repo"**.
2. Selecciona el repositorio de este proyecto (`sistema-cementerio`).
3. Ve a la configuración del servicio recién creado.
4. En la pestaña **Settings** (Configuración):
   - Baja hasta la sección **Build** -> **Root Directory**.
   - Escribe `/backend` y presiona Enter.
   - En **Build Command**, Railway detectará NestJS y usará `npm run build` automáticamente.
   - En **Start Command**, especifica: `npm run start:prod`
5. Ve a la pestaña **Variables** y agrega las siguientes:
   - `PORT`: `3000` (opcional, Railway inyecta el suyo automáticamente).
   - `DATABASE_URL`: Pega el valor de la URL de conexión de la base de datos PostgreSQL que creaste en el paso 1.
   - Añade las demás variables que tengas en tu `.env` del backend.
6. Ve a la pestaña **Networking** y haz clic en **"Generate Domain"** para darle una URL pública a tu backend (ej. `sistema-cementerio-backend.up.railway.app`). **Copia esta URL**, la necesitarás para el frontend.

## 3. Desplegar el Frontend (Angular)
1. En el mismo proyecto de Railway, haz clic en **"New"** -> **"GitHub Repo"** nuevamente y selecciona tu repositorio.
2. Ve rápidamente a la pestaña **Settings** de este nuevo servicio:
   - En la sección **Build** -> **Root Directory**, escribe `/frontend` y presiona Enter.
   - Railway detectará automáticamente Angular y preparará el proyecto para servir un sitio web estático nativamente.
3. Ve a la pestaña **Networking** y haz clic en **"Generate Domain"** para obtener la URL pública de tu aplicación frontend.
4. *Importante:* Para que tu frontend sepa a qué backend conectarse, debes configurar la variable de entorno de Angular o simplemente cambiar la URL base en el código de tu frontend antes de subirlo, apuntando a tu nueva URL pública del backend.

¡Y listo! Al eliminar los archivos de Docker, Railway utilizará su sistema de compilación automático optimizado (Nixpacks).
