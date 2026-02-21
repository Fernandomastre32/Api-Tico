import express from 'express';
import PacienteController from '../controller/Pacientescontroller.js';

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
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     summary: Crear paciente
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       201:
 *         description: Paciente creado
 */

router.get('/pacientes', PacienteController.getAllPacientes);
router.post('/pacientes', PacienteController.createPaciente);

export default router;