import express from 'express';
import MetricasIAController from '../controller/MetricasController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 * schemas:
 * MetricaIA:
 * type: object
 * properties:
 * paciente_id:
 * type: integer
 * cita_id:
 * type: integer
 * frustracion:
 * type: integer
 * latencia_ms:
 * type: integer
 * presion_toque:
 * type: number
 * format: float
 * tiempo_reaccion_ms:
 * type: integer
 * example:
 * paciente_id: 1
 * cita_id: 1
 * frustracion: 2
 * latencia_ms: 35
 * presion_toque: 1.05
 * tiempo_reaccion_ms: 1250
 */

/**
 * @swagger
 * /api/metricas-ia:
 * get:
 * summary: Obtiene todas las métricas registradas
 * tags: [Métricas IA]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de métricas obtenida
 * 401:
 * description: Token requerido
 * post:
 * summary: Registra una nueva métrica de IA desde Unity
 * tags: [Métricas IA]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/MetricaIA'
 * responses:
 * 201:
 * description: Métrica creada exitosamente
 * 401:
 * description: Token requerido
 *
 * /api/metricas-ia/paciente/{pacienteId}:
 * get:
 * summary: Obtiene todas las métricas de un paciente específico
 * tags: [Métricas IA]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: pacienteId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Métricas encontradas
 * 401:
 * description: Token requerido
 */

// Rutas protegidas (Requieren Token de Unity o Postman)
router.get('/metricas-ia', verifyToken, MetricasIAController.getAllMetricas);
router.post('/metricas-ia', verifyToken, MetricasIAController.createMetrica);
router.get('/metricas-ia/paciente/:pacienteId', verifyToken, MetricasIAController.getByPaciente);

export default router;