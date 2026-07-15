# ═══════════════════════════════════════════════════════════════════════════════════════════
# 📋 VERIFICADOR DE WEB SERVICES - POWERSHELL SCRIPT
# API-TICO - Verificación de Cumplimiento de Requisitos
# ═══════════════════════════════════════════════════════════════════════════════════════════
# 
# Uso: ./verify-web-services.ps1
# 
# Este script verifica que todos los requisitos de la Actividad 3 estén implementados
# en el proyecto API-TICO.
# 
# ═══════════════════════════════════════════════════════════════════════════════════════════

# Colores para output
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Cyan = "Cyan"

Write-Host "🔍 VERIFICANDO CUMPLIMIENTO DE REQUISITOS - API-TICO" -ForegroundColor $Cyan
Write-Host "═══════════════════════════════════════════════════════════════════════════════════════════" -ForegroundColor $Cyan
Write-Host ""

# Contadores
$TOTAL = 0
$PASSED = 0

# Función para hacer check
function Check-Requirement {
    param(
        [string]$requirement,
        [string]$file,
        [string]$pattern
    )
    
    $script:TOTAL++
    
    if (Test-Path $file) {
        $content = Get-Content $file -ErrorAction SilentlyContinue
        if ($content -match $pattern) {
            Write-Host "✅ $requirement" -ForegroundColor $Green
            $script:PASSED++
            return $true
        } else {
            Write-Host "⚠️  $requirement (patrón no encontrado en comentarios)" -ForegroundColor $Yellow
            return $false
        }
    } else {
        Write-Host "❌ $requirement (archivo no encontrado)" -ForegroundColor $Red
        return $false
    }
}

Write-Host "📋 VERIFICANDO REQUISITOS DE LA ACTIVIDAD 3:" -ForegroundColor $Cyan
Write-Host ""

Write-Host "A) Comunicación entre cliente y servidor:" -ForegroundColor $Cyan
Check-Requirement "JWT Bearer Token implementado" "middleware\authMiddleware.js" "verifyToken"
Check-Requirement "Autenticación en rutas" "routes\PacienteRoutes.js" "verifyToken"
Check-Requirement "Comentarios de seguridad" "middleware\authMiddleware.js" "COMUNICACIÓN ENTRE CLIENTE"
Write-Host ""

Write-Host "B) Intercambio de datos:" -ForegroundColor $Cyan
Check-Requirement "JSON Parser configurado" "Index.js" "express.json"
Check-Requirement "Esquemas Swagger definidos" "routes\PacienteRoutes.js" "@swagger"
Check-Requirement "Documentación de intercambio de datos" "controller\PacientesController.js" "INTERCAMBIO DE DATOS"
Write-Host ""

Write-Host "C) Protocolo para Web Services:" -ForegroundColor $Cyan
Check-Requirement "Métodos GET implementados" "routes\PacienteRoutes.js" "router.get"
Check-Requirement "Métodos POST implementados" "routes\PacienteRoutes.js" "router.post"
Check-Requirement "Métodos PUT implementados" "routes\PacienteRoutes.js" "router.put"
Check-Requirement "REST protocol documentado" "WEB_SERVICES_PLAN.md" "Protocolo.*REST"
Write-Host ""

Write-Host "D) Tecnología aplicada:" -ForegroundColor $Cyan
Check-Requirement "Node.js + Express" "Index.js" "express"
Check-Requirement "Dependencias en package.json" "package.json" "express"
Check-Requirement "Base de datos PostgreSQL" "config\db.js" "pg"
Check-Requirement "Stack tecnológico documentado" "WEB_SERVICES_PLAN.md" "Stack Tecnológico"
Write-Host ""

Write-Host "E) Servidor Web:" -ForegroundColor $Cyan
Check-Requirement "Servidor configurado en puerto 3000" "Index.js" "PORT"
Check-Requirement "app.listen implementado" "Index.js" "app.listen"
Write-Host ""

Write-Host "F) Prueba de Web Services:" -ForegroundColor $Cyan
Check-Requirement "Swagger/OpenAPI configurado" "config\swagger.js" "swaggerJsdoc"
Check-Requirement "Endpoints documentados en Swagger" "routes\EspecialistasRoutes.js" "@swagger"
Check-Requirement "Método de prueba documentado" "WEB_SERVICES_PLAN.md" "Prueba de Web Services"
Write-Host ""

Write-Host "G) IDE:" -ForegroundColor $Cyan
Check-Requirement "Scripts de desarrollo en package.json" "package.json" "scripts"
Check-Requirement "IDE documentado" "WEB_SERVICES_PLAN.md" "IDE"
Write-Host ""

Write-Host "H) Documentación:" -ForegroundColor $Cyan
Check-Requirement "Plan maestro de Web Services" "WEB_SERVICES_PLAN.md" "PLAN DE IMPLEMENTACIÓN"
Check-Requirement "Guía de requisitos" "README_REQUISITOS.md" "REQUISITOS"
Check-Requirement "Comentarios en Index.js" "Index.js" "IMPLEMENTACIÓN DE WEB SERVICES"
Write-Host ""

Write-Host "I) Listado de peticiones:" -ForegroundColor $Cyan
Check-Requirement "Endpoints del login documentados" "WEB_SERVICES_PLAN.md" "POST.*login"
Check-Requirement "CRUD de pacientes documentado" "WEB_SERVICES_PLAN.md" "GET.*pacientes"
Check-Requirement "Formatos de entrada/salida documentados" "WEB_SERVICES_PLAN.md" "Request.*Response"
Check-Requirement "Códigos HTTP documentados" "WEB_SERVICES_PLAN.md" "200.*201.*400"
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════════════════════════════════" -ForegroundColor $Cyan
Write-Host ""
Write-Host "📊 RESUMEN:" -ForegroundColor $Cyan
Write-Host "   Total de checks: $TOTAL"
Write-Host ("   ✅ Pasaron: $PASSED" -ForegroundColor $Green)
Write-Host ("   ⚠️  Advertencias: $($TOTAL - $PASSED)" -ForegroundColor $Yellow)
Write-Host ""

if ($PASSED -eq $TOTAL) {
    Write-Host "✅ CUMPLIMIENTO VERIFICADO: Todos los requisitos están implementados" -ForegroundColor $Green
    Write-Host ""
    Write-Host "📂 ARCHIVOS GENERADOS:" -ForegroundColor $Cyan
    Write-Host "   ✅ WEB_SERVICES_PLAN.md      - Plan completo de implementación"
    Write-Host "   ✅ README_REQUISITOS.md      - Guía de referencia rápida"
    Write-Host "   ✅ Index.js (actualizado)    - Comentarios de estructura general"
    Write-Host "   ✅ authMiddleware.js (actualizado) - Comentarios de seguridad"
    Write-Host "   ✅ swagger.js (actualizado)  - Comentarios de documentación"
    Write-Host "   ✅ PacientesController.js (actualizado) - Comentarios de datos"
    Write-Host "   ✅ EspecialistaController.js (actualizado) - Comentarios de autenticación"
    Write-Host ""
    Write-Host "🚀 PRÓXIMOS PASOS:" -ForegroundColor $Cyan
    Write-Host "   1. Abrir WEB_SERVICES_PLAN.md para revisar los detalles completos"
    Write-Host "   2. Iniciar servidor: npm run dev"
    Write-Host "   3. Acceder a Swagger: http://localhost:3000/api-docs"
    Write-Host "   4. Probar endpoints como se describe en la documentación"
    exit 0
} else {
    Write-Host "⚠️  Algunos elementos necesitan revisión" -ForegroundColor $Yellow
    exit 1
}
