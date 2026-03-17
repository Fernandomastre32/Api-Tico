import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import especialistaRoutes from './routes/EspecialistasRoutes.js';
import pacienteRoutes from './routes/PacienteRoutes.js';
import tutorRoutes from './routes/TutoresRoutes.js';
import citaRoutes from './routes/CitasRoutes.js';
import pagoRoutes from './routes/PagoRoutes.js';
import metricasIARoutes from './routes/MetricasRoutes.js';
import uploadRoutes from './routes/UploadRoutes.js';
import swaggerDocs from './config/swagger.js';
import path from 'path';

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
   2. Ve a: POST /api/login y envía el email y password reales.
   3. Te retornará un "token" largo. Cópialo.
   4. En Swagger, haz click en el botón "Authorize" 🔒 (arriba) y pégalo allí.
      A partir de ese momento, Swagger añadirá "Authorization: Bearer <tuToken>"
      en las cabeceras a cada Endpoint como la validación técnica que exige.
=========================================================================================== */

// 🔐 Verificación crítica al arranque: JWT_SECRET obligatorio
if (!process.env.JWT_SECRET) {
   console.error('❌ FATAL: JWT_SECRET no está definido en .env. El servidor no iniciará.');
   process.exit(1);
}

const app = express();

// ─── Seguridad en cabeceras HTTP ───────────────────────────────────────────
app.use(helmet({
   crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ─── CORS: solo permitir el origen del frontend ───────────────────────────
// Ajusta el origin a la URL de tu frontend React (Vite usa 5173, CRA usa 3001)
const allowedOrigins = [
   'http://localhost:5173',  // React + Vite (default)
   'http://localhost:5174',  // React + Vite (fallback, cuando 5173 está ocupado)
   'http://localhost:3000',  // React CRA
   'http://localhost:4200',  // Angular (por compatibilidad)
];

app.use(cors({
   origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, curl, Swagger local)
      if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
      } else {
         callback(new Error(`CORS: Origen no permitido: ${origin}`));
      }
   },
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ─── Rutas estáticas para uploads ──────────────────────────────────────────
// Configura la carpeta 'uploads' para que sea accesible públicamente por HTTP
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Rutas de la API ───────────────────────────────────────────────────────
app.use('/api', especialistaRoutes);
app.use('/api', pacienteRoutes);
app.use('/api', tutorRoutes);
app.use('/api', citaRoutes);
app.use('/api', pagoRoutes);
app.use('/api', metricasIARoutes);
app.use('/api', uploadRoutes); // Añadimos endpoint de subida
swaggerDocs(app);

// ─── Manejador global de errores ──────────────────────────────────────────
// Captura errores no controlados (incluyendo errores de CORS)
// y evita que detalles internos lleguen al cliente
app.use((err, req, res, next) => {
   console.error('[UNHANDLED ERROR]', err);
   const statusCode = err.status || 500;
   res.status(statusCode).json({
      message: statusCode === 500
         ? 'Error interno del servidor'
         : err.message
   });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`🚀 Servidor Tico corriendo en http://localhost:${PORT}`);
   console.log(`📖 Documentación disponible en http://localhost:${PORT}/api-docs`);
});