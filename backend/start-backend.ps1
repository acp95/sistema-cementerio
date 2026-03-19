# Script para iniciar el backend de NestJS
# Sistema de Gestión de Cementerio

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Iniciando Backend - Sistema Cementerio" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "Verificando Docker..." -NoNewline
try {
    $dockerPath = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
    if (Test-Path $dockerPath) {
        $dockerInfo = & $dockerPath ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host " [OK]" -ForegroundColor Green
            
            # Verificar contenedor de PostgreSQL
            if ($dockerInfo -match "db_cementerio") {
                Write-Host "Contenedor de PostgreSQL activo [OK]" -ForegroundColor Green
            } else {
                Write-Host "Advertencia: Contenedor db_cementerio no encontrado" -ForegroundColor Yellow
                Write-Host "Iniciando contenedores con docker-compose..." -ForegroundColor Yellow
                Set-Location ..
                & $dockerPath compose up -d
                Set-Location backend
                Start-Sleep -Seconds 3
            }
        } else {
            Write-Host " [ERROR]" -ForegroundColor Red
            Write-Host "Docker no está ejecutándose. Por favor inicia Docker Desktop." -ForegroundColor Red
            Read-Host "Presiona Enter para continuar de todos modos"
        }
    } else {
        Write-Host " [WARNING]" -ForegroundColor Yellow
        Write-Host "Docker no encontrado en la ruta esperada" -ForegroundColor Yellow
    }
} catch {
    Write-Host " [WARNING]" -ForegroundColor Yellow
    Write-Host "No se pudo verificar Docker: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Iniciando servidor NestJS en modo desarrollo..." -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""

# Iniciar el servidor
npm run start:dev
