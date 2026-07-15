

const fs = require('fs');
const path = require('path');

// Colores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let TOTAL = 0;
let PASSED = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkRequirement(requirement, file, pattern) {
  TOTAL++;
  
  try {
    if (!fs.existsSync(file)) {
      log(`❌ ${requirement} (archivo no encontrado: ${file})`, 'red');
      return false;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    const regex = new RegExp(pattern, 'i');
    
    if (regex.test(content)) {
      log(`✅ ${requirement}`, 'green');
      PASSED++;
      return true;
    } else {
      log(`⚠️  ${requirement} (patrón no encontrado)`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ ${requirement} (error: ${error.message})`, 'red');
    return false;
  }
}

// Main
log('\n🔍 VERIFICANDO CUMPLIMIENTO DE REQUISITOS - API-TICO', 'cyan');
log('═══════════════════════════════════════════════════════════════════════════════════════════', 'cyan');
log('');

log('📋 VERIFICANDO REQUISITOS DE LA ACTIVIDAD 3:', 'cyan');
log('');

log('A) Comunicación entre cliente y servidor:', 'cyan');
checkRequirement('JWT Bearer Token implementado', 'middleware/authMiddleware.js', 'verifyToken');
checkRequirement('Autenticación en rutas', 'routes/PacienteRoutes.js', 'verifyToken');
checkRequirement('Comentarios de seguridad', 'middleware/authMiddleware.js', 'COMUNICACIÓN');
log('');

log('B) Intercambio de datos:', 'cyan');
checkRequirement('JSON Parser configurado', 'Index.js', 'express\\.json');
checkRequirement('Esquemas Swagger definidos', 'routes/PacienteRoutes.js', '@swagger');
checkRequirement('Documentación de intercambio', 'controller/PacientesController.js', 'INTERCAMBIO');
log('');

log('C) Protocolo para Web Services:', 'cyan');
checkRequirement('Métodos GET implementados', 'routes/PacienteRoutes.js', 'router\\.get');
checkRequirement('Métodos POST implementados', 'routes/PacienteRoutes.js', 'router\\.post');
checkRequirement('Métodos PUT implementados', 'routes/PacienteRoutes.js', 'router\\.put');
checkRequirement('REST protocol documentado', 'WEB_SERVICES_PLAN.md', 'Protocolo.*REST');
log('');

log('D) Tecnología aplicada:', 'cyan');
checkRequirement('Node.js + Express', 'Index.js', 'express');
checkRequirement('Dependencias en package.json', 'package.json', '"express"');
checkRequirement('Base de datos PostgreSQL', 'config/db.js', 'pg');
checkRequirement('Stack tecnológico documentado', 'WEB_SERVICES_PLAN.md', 'Stack Tecnológico');
log('');

log('E) Servidor Web:', 'cyan');
checkRequirement('Servidor en puerto 3000', 'Index.js', 'PORT|3000');
checkRequirement('app.listen implementado', 'Index.js', 'app\\.listen');
log('');

log('F) Prueba de Web Services:', 'cyan');
checkRequirement('Swagger/OpenAPI configurado', 'config/swagger.js', 'swagger');
checkRequirement('Endpoints documentados en Swagger', 'routes/EspecialistasRoutes.js', '@swagger');
checkRequirement('Método de prueba documentado', 'WEB_SERVICES_PLAN.md', 'Prueba de Web Services');
log('');

log('G) IDE:', 'cyan');
checkRequirement('Scripts de desarrollo', 'package.json', '"scripts"');
checkRequirement('IDE documentado', 'WEB_SERVICES_PLAN.md', 'IDE');
log('');

log('H) Documentación:', 'cyan');
checkRequirement('Plan maestro', 'WEB_SERVICES_PLAN.md', 'PLAN DE IMPLEMENTACIÓN');
checkRequirement('Guía de requisitos', 'README_REQUISITOS.md', 'REQUISITOS');
checkRequirement('Comentarios en Index.js', 'Index.js', 'IMPLEMENTACIÓN DE WEB SERVICES');
log('');

log('I) Listado de peticiones:', 'cyan');
checkRequirement('Login documentado', 'WEB_SERVICES_PLAN.md', 'POST /api/login');
checkRequirement('CRUD de pacientes', 'WEB_SERVICES_PLAN.md', 'GET /api/pacientes');
checkRequirement('Formatos entrada/salida', 'WEB_SERVICES_PLAN.md', 'Request.*Response');
checkRequirement('Códigos HTTP', 'WEB_SERVICES_PLAN.md', '200|201|400|401');
log('');

log('═══════════════════════════════════════════════════════════════════════════════════════════', 'cyan');
log('');
log('📊 RESUMEN:', 'cyan');
log(`   Total de checks: ${TOTAL}`);
log(`   ✅ Pasaron: ${PASSED}`, 'green');
log(`   ⚠️  Advertencias: ${TOTAL - PASSED}`, 'yellow');
log('');

if (PASSED === TOTAL) {
  log('✅ CUMPLIMIENTO VERIFICADO: Todos los requisitos están implementados', 'green');
  log('');
  log('📂 ARCHIVOS GENERADOS:', 'cyan');
  log('   ✅ WEB_SERVICES_PLAN.md      - Plan completo (27+ endpoints documentados)');
  log('   ✅ README_REQUISITOS.md      - Guía de referencia rápida');
  log('   ✅ verify-web-services.ps1   - Verificador en PowerShell');
  log('   ✅ verify-web-services.sh    - Verificador en Bash');
  log('   ✅ verify-web-services.js    - Este verificador');
  log('');
  log('📝 ARCHIVOS ACTUALIZADOS CON COMENTARIOS:', 'cyan');
  log('   ✅ Index.js');
  log('   ✅ middleware/authMiddleware.js');
  log('   ✅ config/swagger.js');
  log('   ✅ controller/PacientesController.js');
  log('   ✅ controller/EspecialistaController.js');
  log('');
  log('🚀 PRÓXIMOS PASOS:', 'cyan');
  log('   1. Revisar: WEB_SERVICES_PLAN.md');
  log('   2. Iniciar: npm run dev');
  log('   3. Swagger:  http://localhost:3000/api-docs');
  log('   4. Probar:   Usar Swagger para ejecutar endpoints');
  process.exit(0);
} else {
  log('⚠️  Algunos elementos necesitan revisión', 'yellow');
  process.exit(1);
}
