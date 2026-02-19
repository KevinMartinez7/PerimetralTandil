# Script para iniciar el entorno de desarrollo completo
# Angular (frontend) + Vercel (API functions)

Write-Host "[INICIO] Iniciando entorno de desarrollo..." -ForegroundColor Cyan
Write-Host ""

# Función para manejar Ctrl+C
$scriptBlock = {
    Write-Host "`n`n[STOP] Deteniendo servidores..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    exit
}

# Registrar manejador de Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action $scriptBlock | Out-Null

Write-Host "[API] Iniciando Vercel Dev en puerto 3001..." -ForegroundColor Green
$vercelJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run api 2>&1
}

Start-Sleep -Seconds 3

Write-Host "[ANGULAR] Iniciando Angular en puerto 4200..." -ForegroundColor Green
$angularJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm start 2>&1
}

Write-Host ""
Write-Host "[OK] Servidores iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] URLs disponibles:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:4200" -ForegroundColor White
Write-Host "   API:      http://localhost:3001/api/send-email" -ForegroundColor White
Write-Host ""
Write-Host "[TIP] Para detener ambos servidores, presiona Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "[LOGS] Mostrando logs..." -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor DarkGray

# Mostrar logs de ambos trabajos
try {
    while ($true) {
        $vercelOutput = Receive-Job -Job $vercelJob 2>&1
        $angularOutput = Receive-Job -Job $angularJob 2>&1
        
        if ($vercelOutput) {
            $vercelOutput | ForEach-Object {
                Write-Host "[Vercel] $_" -ForegroundColor Magenta
            }
        }
        
        if ($angularOutput) {
            $angularOutput | ForEach-Object {
                Write-Host "[Angular] $_" -ForegroundColor Blue
            }
        }
        
        # Verificar si algún job terminó
        if ($vercelJob.State -eq "Failed" -or $vercelJob.State -eq "Stopped") {
            Write-Host "[ERROR] Vercel Dev fallo o se detuvo" -ForegroundColor Red
            break
        }
        
        if ($angularJob.State -eq "Failed" -or $angularJob.State -eq "Stopped") {
            Write-Host "[ERROR] Angular fallo o se detuvo" -ForegroundColor Red
            break
        }
        
        Start-Sleep -Milliseconds 500
    }
}
finally {
    Write-Host "`n[CLEANUP] Limpiando..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "[OK] Servidores detenidos" -ForegroundColor Green
}
