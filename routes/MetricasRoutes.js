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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetricaIA'
 *     responses:
 *       201:
 *         description: Métrica creada
 *       401:
 *         description: Token requerido
 *
 * /api/metricas-ia/paciente/{pacienteId}:
 *   get:
 *     summary: Obtiene métricas de un paciente
 *     tags: [Métricas IA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Métricas encontradas
 *       401:
 *         description: Token requerido
 */

import express from 'express';
import MetricasIAController from '../controller/MetricasController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/metricas-ia', verifyToken, MetricasIAController.createMetrica);
router.get('/metricas-ia/paciente/:pacienteId', verifyToken, MetricasIAController.getByPaciente);

export default router;