# 🚀 Guía de Despliegue - Sistema de Cementerio (Gratis)

Este documento te guiará para subir tu sistema a la nube usando herramientas gratuitas.

## 1. Base de Datos (Supabase) - Permanente Gratis
1. Ve a [Supabase.com](https://supabase.com/) y crea una cuenta.
2. Crea un **Nuevo Proyecto**.
3. En la configuración del proyecto, ve a **Settings > Database**.
4. Copia los datos de **Connection info**: Host, Port, User, Password (el que elegiste al crear el proyecto) y Database name (usualmente `postgres`).
5. **IMPORTANTE**: Estos datos los usaremos en el paso 2.

## 2. Backend (Render) - Nivel Gratis
1. Ve a [Render.com](https://render.com/) y conecta tu cuenta de GitHub.
2. Haz clic en **New > Web Service**.
3. Selecciona tu repositorio `sistema-cementerio`.
4. Elige la carpeta **Root Directory**: `backend`.
5. **Runtime**: Node.
6. **Build Command**: `npm install && npm run build`.
7. **Start Command**: `npm run start:prod`.
8. Ve a la pestaña **Environment** y añade las siguientes variables:
   - `DB_HOST`: (Tu host de Supabase)
   - `DB_PORT`: `5432`
   - `DB_USERNAME`: `postgres`
   - `DB_PASSWORD`: (Tu password de Supabase)
   - `DB_NAME`: `postgres`
   - `JWT_SECRET`: (Cualquier clave secreta larga)
   - `NODE_ENV`: `production`
9. Haz clic en **Create Web Service**. ¡Render te dará una URL (ej: `sistema-backend.onrender.com`)!

## 3. Frontend (Vercel) - Nivel Gratis
1. Ve a [Vercel.com](https://vercel.com/) y conecta tu GitHub.
2. Haz clic en **Add New > Project**.
3. Selecciona tu repositorio.
4. **Root Directory**: `frontend`.
5. **Framework Preset**: Angular.
6. **Build Command**: `npm run build`.
7. **Output Directory**: `dist/frontend/browser`.
8. En la sección **Environment Variables**, añade:
   - `API_URL`: (La URL que te dio Render en el paso anterior, terminada en `/api`)
9. Haz clic en **Deploy**.

---

## 🛠️ Notas Adicionales
- **Cold Start**: Como es gratis, el backend de Render se "duerme" si no se usa. La primera vez que entres al día, puede tardar unos 30 segundos en cargar.
- **Seguridad**: Nunca subas el archivo `.env` a GitHub. Usa las variables de entorno de los paneles de control (Render/Vercel).
- **Actualización**: Cada vez que hagas `git push` a tu repositorio de GitHub, tanto Render como Vercel se actualizarán automáticamente.
