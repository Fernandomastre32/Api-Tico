import express from 'express';
import CitaController from '../controller/CitasController.js';

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
 *     responses:
 *       200:
 *         description: Lista de citas obtenida
 *   post:
 *     summary: Crea una nueva cita
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cita'
 *     responses:
 *       201:
 *         description: Cita creada
 */

router.get('/citas', CitaController.getAllCitas);
router.post('/citas', CitaController.createCita);

export default router;