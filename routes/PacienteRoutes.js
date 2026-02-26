import express from 'express';
import PacienteController from '../controller/PacientesController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         tutor_id:
 *           type: integer
 *         especialista_asignado_id:
 *           type: integer
 *         monto_mensual:
 *           type: number
 */

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Lista de pacientes
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Token requerido
 *   post:
 *     summary: Crear paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       201:
 *         description: Paciente creado
 *       401:
 *         description: Token requerido
 */

router.get('/pacientes', verifyToken, PacienteController.getAllPacientes);
router.post('/pacientes', verifyToken, PacienteController.createPaciente);

export default router;