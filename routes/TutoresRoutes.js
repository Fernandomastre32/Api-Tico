import express from 'express';
import TutorController from '../controller/TutoresController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Tutor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         parentesco:
 *           type: string
 *         email:
 *           type: string
 *         telefono:
 *           type: string
 */

/**
 * @swagger
 * /api/tutores:
 *   get:
 *     summary: Listar tutores
 *     tags: [Tutores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Token requerido
 */

router.get('/tutores', verifyToken, TutorController.getAllTutores);

export default router;