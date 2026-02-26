import Especialista from '../models/EspecialistaModels.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { revokeToken } from '../middleware/authMiddleware.js';
import { resetLoginAttempts } from '../middleware/rateLimiter.js';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

class EspecialistaController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email y contraseña son requeridos' });
            }

            const especialista = await Especialista.findByEmailForAuth(email);
            if (!especialista) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const isMatch = await bcrypt.compare(password, especialista.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Login exitoso: reiniciar contador de intentos de esta IP
            const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
            resetLoginAttempts(ip);

            const payload = {
                id: especialista.id,
                rol_id: especialista.rol_id,
                especialidad: especialista.especialidad_principal
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            res.json({ message: 'Autenticado con éxito', token });
        } catch (error) {
            // 🔒 Nunca exponer detalles del error interno al cliente
            console.error('[LOGIN ERROR]', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async logout(req, res) {
        try {
            // req.token fue guardado por verifyToken
            revokeToken(req.token);
            res.json({ message: 'Sesión cerrada correctamente. Token invalidado.' });
        } catch (error) {
            console.error('[LOGOUT ERROR]', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async getAllEspecialistas(req, res) {
        try {
            const especialistas = await Especialista.findAll();
            res.json({ message: 'Lista de todos los Especialistas', data: especialistas });
        } catch (error) {
            console.error('[GET_ALL_ESPECIALISTAS ERROR]', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async createEspecialista(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const especialista = await Especialista.create(req.body);
            res.status(201).json({ message: 'Especialista creado exitosamente', data: especialista });
        } catch (error) {
            console.error('[CREATE_ESPECIALISTA ERROR]', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async getEspecialistaById(req, res) {
        try {
            const especialista = await Especialista.findById(req.params.id);
            if (!especialista) return res.status(404).json({ message: 'Especialista no encontrado' });
            res.json({ message: 'Especialista encontrado', data: especialista });
        } catch (error) {
            console.error('[GET_ESPECIALISTA_BY_ID ERROR]', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async updateEspecialista(req, res) {
        try {
            const especialista = await Especialista.update(req.params.id, req.body);
            if (!especialista) return res.status(404).json({ message: 'Especialista no encontrado' });
            res.json({ message: 'Especialista actualizado', data: especialista });
        } catch (error) {
            console.error('[UPDATE_ESPECIALISTA ERROR]', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async deleteEspecialista(req, res) {
        try {
            const eliminado = await Especialista.delete(req.params.id);
            if (!eliminado) return res.status(404).json({ message: 'Especialista no encontrado' });
            res.json({ message: 'Especialista desactivado correctamente', data: eliminado });
        } catch (error) {
            console.error('[DELETE_ESPECIALISTA ERROR]', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

export default EspecialistaController;
