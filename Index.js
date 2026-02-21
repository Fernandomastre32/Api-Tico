import express from 'express';
import especialistaRoutes from './routes/EspecialistasRoutes.js';
import pacienteRoutes from './routes/PacienteRoutes.js';
import tutorRoutes from './routes/TutoresRoutes.js';
import citaRoutes from './routes/CitasRoutes.js';
import pagoRoutes from './routes/PagoRoutes.js';
import metricasIARoutes from './routes/MetricasRoutes.js';
import swaggerDocs from './config/swagger.js';
const app = express();
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