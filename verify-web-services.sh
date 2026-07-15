#!/bin/bash
# 📋 VERIFICADOR DE WEB SERVICES - SCRIPT DE VALIDACIÓN
# ═══════════════════════════════════════════════════════════════════════════════════════════

echo "🔍 VERIFICANDO CUMPLIMIENTO DE REQUISITOS - API-TICO"
echo "═══════════════════════════════════════════════════════════════════════════════════════════"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de checks
TOTAL=0
PASSED=0

# Función para hacer check
check_requirement() {
    local req=$1
    local file=$2
    local pattern=$3
    
    TOTAL=$((TOTAL + 1))
    
    if [ -f "$file" ]; then
        if grep -q "$pattern" "$file" 2>/dev/null; then
            echo -e "${GREEN}✅${NC} $req"
            PASSED=$((PASSED + 1))
            return 0
        else
            echo -e "${YELLOW}⚠️${NC}  $req (patrón no encontrado en comentarios)"
            return 1
        fi
    else
        echo -e "${RED}❌${NC} $req (archivo no encontrado)"
        return 1
    fi
}

echo "📋 VERIFICANDO REQUISITOS DE LA ACTIVIDAD 3:"
echo ""

echo "A) Comunicación entre cliente y servidor:"
check_requirement "JWT Bearer Token" "middleware/authMiddleware.js" "verifyToken"
check_requirement "Autenticación en rutas" "routes/PacienteRoutes.js" "verifyToken"
echo ""

echo "B) Intercambio de datos:"
check_requirement "JSON Parser (Express)" "Index.js" "express.json"
check_requirement "Esquemas de datos" "routes/PacienteRoutes.js" "@swagger"
check_requirement "Validación de entrada" "controller/PacientesController.js" "validar\|validate\|email"
echo ""

echo "C) Protocolo para Web Services:"
check_requirement "REST GET" "routes/PacienteRoutes.js" "router.get"
check_requirement "REST POST" "routes/PacienteRoutes.js" "router.post"
check_requirement "REST PUT" "routes/PacienteRoutes.js" "router.put"
echo ""

echo "D) Tecnología aplicada:"
check_requirement "Node.js + Express" "Index.js" "express"
check_requirement "Dependencias definidas" "package.json" "express"
check_requirement "Base de datos" "config/db.js" "pool\|database"
echo ""

echo "E) Servidor Web:"
check_requirement "Servidor en puerto 3000" "Index.js" "PORT.*3000\|app.listen"
echo ""

echo "F) Prueba de Web Services:"
check_requirement "Swagger/OpenAPI configurado" "config/swagger.js" "swagger"
check_requirement "API documentada en Swagger" "routes/EspecialistasRoutes.js" "@swagger"
echo ""

echo "G) IDE:"
check_requirement "Configuración de desarrollo" "package.json" "scripts"
echo ""

echo "H) Documentación:"
check_requirement "Plan de Web Services" "WEB_SERVICES_PLAN.md" "Web Services"
check_requirement "Guía de requisitos" "README_REQUISITOS.md" "REQUISITOS"
echo ""

echo "I) Listado de peticiones:"
check_requirement "Endpoints documentados en Plan" "WEB_SERVICES_PLAN.md" "POST /api\|GET /api"
check_requirement "Formatos de entrada/salida" "WEB_SERVICES_PLAN.md" "Entradas.*Request\|Salidas.*Response"
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════════════════"
echo ""
echo "📊 RESUMEN:"
echo -e "   Total de checks: $TOTAL"
echo -e "   ${GREEN}Pasaron: $PASSED${NC}"
echo -e "   ${YELLOW}Advertencias: $((TOTAL - PASSED))${NC}"
echo ""

if [ $PASSED -eq $TOTAL ]; then
    echo -e "${GREEN}✅ CUMPLIMIENTO VERIFICADO: Todos los requisitos están implementados${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Algunos elementos necesitan revisión${NC}"
    exit 1
fi
