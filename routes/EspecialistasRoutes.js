import express from 'express';
import { body } from 'express-validator';
import EspecialistaController from '../controller/EspecialistaController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Especialista:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         rol_id:
 *           type: integer
 *         nombre:
 *           type: string
 *         email:
 *           type: string
 *         especialidad_principal:
 *           type: string
 */

/**
 * @swagger
 * /api/especialistas:
 *   get:
 *     summary: Obtiene lista de especialistas
 *     tags: [Especialistas]
 *     responses:
 *       200:
 *         description: Éxito
 *   post:
 *     summary: Crea un especialista
 *     tags: [Especialistas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Especialista'
 *     responses:
 *       201:
 *         description: Creado
 */

import { verifyToken, authorize, checkOwnerOrAdmin } from '../middleware/authMiddleware.js';

router.post('/login', EspecialistaController.login);

// Denegación por defecto: Usar use() o colocar middlewares. Aquí protegemos todas las siguientes excepto POST y GET públicas.
// Solo admin (ej. rol_id 1) o autenticados viendo sus recursos pueden acceder.
router.get('/especialistas', verifyToken, authorize([1]), EspecialistaController.getAllEspecialistas);

const createEspecialistaValidations = [
    body('nombre').notEmpty().withMessage('Nombre es requerido').trim().escape(),
    body('email').isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres').trim(),
    body('especialidad_principal').notEmpty().withMessage('Especialidad es requerida').trim().escape()
];

// Creación podría ser abierta o solo de admin. En este ejemplo lo dejamos abierto (registro) pero con validación
router.post('/especialistas', createEspecialistaValidations, EspecialistaController.createEspecialista);

// Prevención de IDOR: Un especialista solo puede verse, editarse o borrarse a sí mismo, a menos que sea ADMIN (rol 1)
router.get('/especialistas/:id', verifyToken, checkOwnerOrAdmin, EspecialistaController.getEspecialistaById);
router.put('/especialistas/:id', verifyToken, checkOwnerOrAdmin, EspecialistaController.updateEspecialista);
router.delete('/especialistas/:id', verifyToken, authorize([1]), EspecialistaController.deleteEspecialista); // Solo admin elimina

export default router;