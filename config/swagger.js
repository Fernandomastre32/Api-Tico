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
            title: 'API de Estudio AF', // Título de la documentación
            version: '1.0.0',           // Versión de la API
            description: 'Documentación de API de Estudio AF. NOTA: Para la mayoría de solicitudes POST/GET/PUT/DELETE debes usar un Token. Obtén uno en /api/login, luego clica el botón "Authorize" 🔒 en la parte superior e introdúcelo como Bearer Token.',
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
    console.log('Swagger docs available at http://localhost:' +
        process.env.PORT + '/api-docs');
};

export default swaggerDocs;