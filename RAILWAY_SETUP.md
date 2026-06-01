# Guía Rápida: Despliegue en Railway

## 🚀 Pasos para desplegar:

### 1️⃣ En Railway.app (en la web)

- Ve a [railway.app](https://railway.app)
- Inicia sesión con GitHub
- Click en **"New Project"**
- Selecciona **"Deploy from GitHub repo"**
- Conecta tu cuenta de GitHub si no está conectada
- Busca y selecciona: **`acp95/sistema-cementerio`**

### 2️⃣ Railway detectará automáticamente:

Railway verá que es un **monorepo** con:
- Backend en `/backend` (NestJS)
- Frontend en `/frontend` (Angular)

Se crearán 2 servicios automáticamente.

### 3️⃣ Configurar variables de entorno (en Railway UI)

**En el servicio backend**, agregar estas variables:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_contraseña_segura
DATABASE_NAME=cementerio_db
JWT_SECRET=tu_secreto_jwt_seguro
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://tu-frontend.up.railway.app
```

### 4️⃣ El deploy automático ya está configurado

Cada vez que hagas `git push` a la rama `main`, GitHub Actions:
- Detectará el cambio
- Usará el token `RAILWAY_TOKEN` guardado en Secrets
- Le dirá a Railway que despliegue automáticamente

---

## ✅ Checklist de configuración

- [ ] Proyecto conectado a Railway
- [ ] Backend y frontend creados como servicios
- [ ] Base de datos PostgreSQL agregada
- [ ] Variables de entorno configuradas en backend
- [ ] Token `RAILWAY_TOKEN` guardado en GitHub Secrets
- [ ] Primer despliegue completado
- [ ] Pruebas: acceder a frontend y verificar conexión al backend

---

## 📌 URLs de acceso

Una vez desplegado, Railway te proporciona URLs como:

- **Frontend**: `https://sistema-cementerio-frontend-xxx.up.railway.app`
- **Backend**: `https://sistema-cementerio-backend-xxx.up.railway.app`

El frontend está configurado para conectarse automáticamente al backend.

---

## 🔄 Despliegues futuros

Solo necesitas hacer push a `main`:

```bash
git add .
git commit -m "Tu mensaje"
git push origin main
```

Railway se encargará del resto automáticamente ✨

---

¿Necesitas ayuda con algo específico?
