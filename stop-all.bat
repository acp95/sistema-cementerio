@echo off
echo Deteniendo contenedores Docker...
docker-compose down

echo.
echo ========================================
echo Contenedores detenidos exitosamente
echo.
echo Para iniciarlos nuevamente ejecuta:
echo   docker-compose up -d
echo ========================================
pause
