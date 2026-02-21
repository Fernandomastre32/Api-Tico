import express from 'express';
import TutorController from '../controller/TutoresController.js';

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
 *     responses:
 *       200:
 *         description: OK
 */

router.get('/tutores', TutorController.getAllTutores);

export default router;