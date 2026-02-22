import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import especialistaRoutes from './routes/EspecialistasRoutes.js';
import pacienteRoutes from './routes/PacienteRoutes.js';
import tutorRoutes from './routes/TutoresRoutes.js';
import citaRoutes from './routes/CitasRoutes.js';
import pagoRoutes from './routes/PagoRoutes.js';
import metricasIARoutes from './routes/MetricasRoutes.js';
import swaggerDocs from './config/swagger.js';

/* =========================================================================================
   GUÍA DE SEGURIDAD (TOKEN JWT) Y ROLES PARA interactuar o usar POST/GET/DELETE:
   =========================================================================================
   Actualmente toda esta API (rutas POST, PUT, GET (listas), DELETE) excepto el '/login', 
   están protegidas por 3 capas:
     1. verifyToken       -> Exige un Token JWT activo en los encabezados.
     2. authorize([1])    -> Exige un Rol Específico (Roles Permitidos: 1=Admin). 
     3. checkOwnerOrAdmin -> Exige que tu user id en el token coincida con el recurso que pides.

   ¿Cómo probar en Swagger o REST Client?
   1. Crea un usuario si no existe, a través de tu DB de forma manual para asignar "rol_id" 1.
      (o desprotege momentáneamente POST /api/especialistas quitando validaciones para crearte uno nuevo).
   2. Ve a: POST /api/login y envía el email y password reales.
   3. Te retornará un "token" largo. Cópialo.
   4. En Swagger, haz click en el botón "Authorize" 🔒 (arriba) y pégalo allí.
      A partir de ese momento, Swagger añadirá "Authorization: Bearer <tuToken>"
      en las cabeceras a cada Endpoint como la validación técnica que exige.
=========================================================================================== */

const app = express();

// Seguridad en tránsito y cabeceras
app.use(helmet());
app.use(cors());

app.use(express.json());

// Definición de prefijos para la API
app.use('/api', especialistaRoutes);
app.use('/api', pacienteRoutes);
app.use('/api', tutorRoutes);
app.use('/api', citaRoutes);
app.use('/api', pagoRoutes);
app.use('/api', metricasIARoutes);
swaggerDocs(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Tico corriendo en http://localhost:${PORT}`);
    console.log(`📖 Documentación disponible en http://localhost:${PORT}/api-docs`);
});