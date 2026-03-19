# 🔧 SOLUCIÓN: Error de Autenticación PostgreSQL

## ❌ Problema Identificado

Git Bash **NO tiene acceso a los comandos de Docker** en tu sistema.
Los comandos de Docker solo funcionan en **PowerShell** o **Command Prompt (CMD)**.

## ✅ SOLUCIÓN RÁPIDA

### Paso 1: Detén el servidor NestJS
En la terminal donde está corriendo `npm run start:dev`, presiona **Ctrl+C**

### Paso 2: Ejecuta el script de reinicio
Haz **doble clic** en el archivo:
```
reset-db.bat
```

Este archivo está en: `C:\Users\ANTONIO\Desktop\sistema-cementerio\reset-db.bat`

El script hará:
- ✅ Detener contenedores existentes
- ✅ Eliminar volúmenes con credenciales antiguas  
- ✅ Crear contenedores frescos con credenciales correctas
- ✅ Esperar 15 segundos para que PostgreSQL inicie

### Paso 3: Inicia el backend
Una vez que el script termine, ve a **Git Bash** y ejecuta:

```bash
cd ~/Desktop/sistema-cementerio/backend
npm run start:dev
```

## 🎯 Deberías Ver

```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] LOG [NestApplication] Nest application successfully started
[Nest] LOG Application is running on: http://localhost:3000
```

---

## 🔍 Alternativa: Usar PowerShell Manualmente

Si prefieres ejecutar los comandos manualmente:

1. Abre **PowerShell** (no Git Bash)
2. Navega al directorio:
   ```powershell
   cd C:\Users\ANTONIO\Desktop\sistema-cementerio
   ```

3. Ejecuta estos comandos:
   ```powershell
   docker-compose down -v
   docker-compose up -d
   Start-Sleep -Seconds 15
   docker-compose ps
   ```

4. Luego en **Git Bash**:
   ```bash
   cd ~/Desktop/sistema-cementerio/backend
   npm run start:dev
   ```

---

## 📌 Resumen del Problema

- **Git Bash**: No tiene Docker → ❌ No usar para comandos Docker
- **PowerShell/CMD**: Tiene Docker → ✅ Usar para comandos Docker  
- **Archivos .bat**: Se ejecutan con doble clic → ✅ Más fácil

---

## ✅ Credenciales PostgreSQL

Después del reinicio, estas son las credenciales correctas:

```
Host: localhost
Puerto: 5432
Usuario: admin
Password: admin123
Base de datos: cementerio_db
```

Estas coinciden con el archivo `backend/.env`
