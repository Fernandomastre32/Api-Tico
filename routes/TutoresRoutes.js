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
 * /api/tutores/login-unity:
 *   post:
 *     summary: Login de Tutores (Unity)
 *     tags: [Tutores]
 *     description: Autenticación de tutores. Retorna un Token JWT válido por 8 horas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: "prueba@test.com"
 *                 description: Email o teléfono del tutor
 *               password:
 *                 type: string
 *                 example: "Prueba123!"
 *                 description: Contraseña del tutor
 *             required:
 *               - usuario
 *               - password
 *     responses:
 *       200:
 *         description: Login exitoso - retorna token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Login exitoso"
 *                 token:
 *                   type: string
 *                   description: JWT Bearer Token válido por 8 horas
 *                 tutor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     email:
 *                       type: string
 *                     telefono:
 *                       type: string
 *       401:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error interno del servidor
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

router.post('/tutores/login-unity', TutorController.loginUnity);
router.get('/tutores', verifyToken, TutorController.getAllTutores);
export default router;