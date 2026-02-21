/**
 * @swagger
 * components:
 *   schemas:
 *     MetricaIA:
 *       type: object
 *       properties:
 *         paciente_id:
 *           type: integer
 *         nivel_ansiedad:
 *           type: integer
 *         nivel_lenguaje:
 *           type: integer
 *         nivel_interaccion:
 *           type: integer
 *         fecha_analisis:
 *           type: string
 *           format: date-time
 *       example:
 *         paciente_id: 1
 *         nivel_ansiedad: 3
 *         nivel_lenguaje: 5
 *         nivel_interaccion: 4
 *         fecha_analisis: "2026-02-20T10:00:00Z"
 */

/**
 * @swagger
 * /api/metricas-ia:
 *   post:
 *     summary: Registra una nueva métrica de IA
 *     tags: [Métricas IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetricaIA'
 *     responses:
 *       201:
 *         description: Métrica creada
 */

import express from 'express';
import MetricasIAController from '../controller/MetricasController.js';

const router = express.Router();

router.post('/metricas-ia', MetricasIAController.createMetrica);
router.get('/metricas-ia/paciente/:pacienteId', MetricasIAController.getByPaciente);

export default router;