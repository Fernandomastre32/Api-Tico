/**
 * @swagger
 * components:
 *   schemas:
 *     Pago:
 *       type: object
 *       properties:
 *         paciente_id:
 *           type: integer
 *         monto:
 *           type: number
 *         fecha_pago:
 *           type: string
 *           format: date-time
 *         metodo_pago:
 *           type: string
 *         estado_pago:
 *           type: string
 *       example:
 *         paciente_id: 1
 *         monto: 1500.00
 *         fecha_pago: "2026-02-20T10:00:00Z"
 *         metodo_pago: "Transferencia"
 *         estado_pago: "Pagado"
 */

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Lista todos los pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista obtenida
 *   post:
 *     summary: Registra un nuevo pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       201:
 *         description: Pago registrado
 *
 * /api/pagos/{id}:
 *   get:
 *     summary: Obtiene un pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago encontrado
 *       404:
 *         description: Pago no encontrado
 */

import express from 'express';
import PagoController from '../controller/PagoController.js';

const router = express.Router();

router.get('/pagos', PagoController.getAllPagos);
router.post('/pagos', PagoController.createPago);
router.get('/pagos/:id', PagoController.getPagoById);

export default router;