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

router.get('/especialistas', EspecialistaController.getAllEspecialistas);

const createEspecialistaValidations = [
    body('nombre').notEmpty().withMessage('Nombre es requerido').trim().escape(),
    body('email').isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres').trim(),
    body('especialidad_principal').notEmpty().withMessage('Especialidad es requerida').trim().escape()
];

router.post('/especialistas', createEspecialistaValidations, EspecialistaController.createEspecialista);

export default router;