@echo off
echo Deteniendo y eliminando contenedores y volumenes...
docker-compose down -v

echo.
echo Iniciando contenedores con volumenes frescos...
docker-compose up -d

echo.
echo Esperando 15 segundos para que PostgreSQL este listo...
timeout /t 15 /nobreak

echo.
echo Verificando estado de los contenedores...
docker-compose ps

echo.
echo ========================================
echo Base de datos lista!
echo Ahora ejecuta en Git Bash:
echo   cd backend
echo   npm run start:dev
echo ========================================
pause
