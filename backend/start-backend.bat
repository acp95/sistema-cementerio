@echo off
echo =========================================
echo  Iniciando Backend - Sistema Cementerio
echo =========================================
echo.

cd /d "%~dp0"

echo Verificando que Docker este ejecutandose...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta en ejecucion.
    echo Por favor, inicia Docker Desktop y vuelve a intentarlo.
    pause
    exit /b 1
)

echo [OK] Docker esta ejecutandose
echo.

echo Verificando contenedores de la base de datos...
docker ps | findstr "db_cementerio" >nul
if errorlevel 1 (
    echo [ADVERTENCIA] El contenedor de PostgreSQL no esta ejecutandose.
    echo Iniciando contenedores...
    cd ..
    docker-compose up -d
    cd backend
    timeout /t 5 >nul
) else (
    echo [OK] Contenedor de PostgreSQL esta activo
)
echo.

echo Iniciando servidor NestJS en modo desarrollo...
echo Presiona Ctrl+C para detener el servidor
echo.
npm run start:dev
