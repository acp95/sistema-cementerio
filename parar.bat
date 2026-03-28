@echo off
echo =========================================
echo  Deteniendo Backend y Frontend
echo =========================================
taskkill /f /im node.exe 2>nul
echo.
echo [OK] Servicios detenidos.
echo =========================================
pause
