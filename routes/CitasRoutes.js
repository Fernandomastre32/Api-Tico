import express from 'express';
import CitaController from '../controller/CitasController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cita:
 *       type: object
 *       properties:
 *         paciente_id:
 *           type: integer
 *         especialista_id:
 *           type: integer
 *         fecha_cita:
 *           type: string
 *           format: date-time
 *         estado_cita:
 *           type: string
 *         progreso_terapia_pct:
 *           type: integer
 */

/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Obtiene todas las citas
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas obtenida
 *       401:
 *         description: Token requerido
 *   post:
 *     summary: Crea una nueva cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cita'
 *     responses:
 *       201:
 *         description: Cita creada
 *       401:
 *         description: Token requerido
 */

router.get('/citas', verifyToken, CitaController.getAllCitas);
router.post('/citas', verifyToken, CitaController.createCita);

export default router;