import express from 'express';
import { body } from 'express-validator';
import EspecialistaController from '../controller/EspecialistaController.js';
import { verifyToken, authorize, checkOwnerOrAdmin } from '../middleware/authMiddleware.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

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
 * /api/login:
 *   post:
 *     summary: Iniciar sesión para obtener Token JWT
 *     description: Retorna un Token JWT. Máximo 5 intentos por IP cada 15 minutos. Cópialo y pégalo en el botón "Authorize" 🔒 en la parte superior.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticado con éxito (Retorna Token)
 *       400:
 *         description: Faltan credenciales
 *       401:
 *         description: Credenciales inválidas
 *       429:
 *         description: Demasiados intentos. Rate limit activo.
 */
router.post('/login', loginRateLimiter, EspecialistaController.login);

/**
 * @swagger
 * /api/verify-2fa:
 *   post:
 *     summary: Autenticación de doble factor
 *     description: Valida el código de 6 dígitos enviado por correo para completar el inicio de sesión.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticado con éxito (Retorna Token)
 *       401:
 *         description: Código inválido o expirado
 */
router.post('/verify-2fa', EspecialistaController.verify2FA);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Cerrar sesión e invalidar Token JWT
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: Token requerido o inválido
 */
router.post('/logout', verifyToken, EspecialistaController.logout);

/**
 * @swagger
 * /api/especialistas:
 *   get:
 *     summary: Obtiene lista de especialistas
 *     tags: [Especialistas]
 *     security:
 *       - bearerAuth: []
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
router.get('/especialistas', verifyToken, authorize([1]), EspecialistaController.getAllEspecialistas);
router.post('/login-unity', EspecialistaController.loginUnity);


const createEspecialistaValidations = [
    body('nombre').notEmpty().withMessage('Nombre es requerido').trim().escape(),
    body('email').isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres').trim(),
    body('especialidad_principal').notEmpty().withMessage('Especialidad es requerida').trim().escape(),
    body('cedula_profesional').optional({ checkFalsy: true }).isNumeric().withMessage('La cédula debe ser numérica').isLength({ min: 7, max: 10 }).withMessage('La cédula debe tener entre 7 y 10 dígitos')
];

const updateEspecialistaValidations = [
    body('nombre').optional().notEmpty().withMessage('Nombre es requerido').trim().escape(),
    body('email').optional().isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    body('especialidad_principal').optional().notEmpty().withMessage('Especialidad es requerida').trim().escape(),
    body('cedula_profesional').optional({ checkFalsy: true }).isNumeric().withMessage('La cédula debe ser numérica').isLength({ min: 7, max: 10 }).withMessage('La cédula debe tener entre 7 y 10 dígitos'),
    // Sin .escape() para no corromper caracteres especiales en la biografía (comillas, acentos, etc.)
    body('biografia').optional({ nullable: true }).trim()
];

router.post('/especialistas', createEspecialistaValidations, EspecialistaController.createEspecialista);

// Protección IDOR: un especialista solo puede ver/editar su propio perfil, Admin puede todo
router.get('/especialistas/:id', verifyToken, checkOwnerOrAdmin, EspecialistaController.getEspecialistaById);
router.put('/especialistas/:id', verifyToken, checkOwnerOrAdmin, updateEspecialistaValidations, EspecialistaController.updateEspecialista);
router.delete('/especialistas/:id', verifyToken, authorize([1]), EspecialistaController.deleteEspecialista);

export default router;