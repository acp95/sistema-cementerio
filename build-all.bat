@echo off
echo ====================================================
echo   BUILD ALL - SISTEMA DE CEMENTERIO
echo ====================================================

echo [1/2] Compilando BACKEND (NestJS)...
cd backend
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo Error en la compilación del Backend.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [2/2] Compilando FRONTEND (Angular)...
cd frontend
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo Error en la compilación del Frontend.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ====================================================
echo   COMPILACIÓN COMPLETADA EXITOSAMENTE
echo   Las carpetas /dist estan listas.
echo ====================================================
pause
