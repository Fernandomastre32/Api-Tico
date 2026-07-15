import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Configuración de Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API-TICO - Sistema de Terapia Integral Computarizada', // Título de la documentación
            version: '1.0.0',           // Versión de la API
            description: '📋 DOCUMENTACIÓN DE WEB SERVICES\n\nNOTA: Para la mayoría de solicitudes POST/GET/PUT/DELETE debes usar un Token JWT.\n\n📝 PASOS:\n1. Ir a POST /api/login\n2. Ingresa credenciales (email/password)\n3. Copia el "token" de la respuesta\n4. Haz clic en "Authorize" 🔒 (arriba)\n5. Pégalo como "Bearer <token>"\n6. ¡Listo! Ahora puedes probar todos los endpoints\n\n✅ Formato de datos: JSON\n✅ Protocolo: REST HTTP\n✅ Autenticación: JWT Bearer Token\n✅ Documentación: Ver WEB_SERVICES_PLAN.md en la raíz del proyecto',
        },
        servers: [
            {
                url: 'http://localhost:' + process.env.PORT, // URL base del servidor de la API
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa el token JWT obtenido de POST /api/login'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js'], // Rutas donde están tus archivos de rutas para generar la documentación automáticamente
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve,
        swaggerUi.setup(swaggerSpec));
    console.log(`\n📚 ═════════════════════════════════════════════════════════════`);
    console.log(`📚 Swagger UI disponible en http://localhost:${process.env.PORT}/api-docs`);
    console.log(`📚 ═════════════════════════════════════════════════════════════\n`);
};

export default swaggerDocs;