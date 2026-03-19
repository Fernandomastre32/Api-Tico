import Especialista from '../models/EspecialistaModels.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { revokeToken } from '../middleware/authMiddleware.js';
import { resetLoginAttempts } from '../middleware/rateLimiter.js';
import { verificarCedulaSEP } from '../utils/sepValidator.js';
import { send2FACode } from '../utils/emailService.js';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Almacén temporal para los códigos 2FA (en producción usar Redis o DB)
// Estructura: { email: { code, expiresAt, userPayload } }
const temporaryCodes = new Map();

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

            // Login exitoso credenciales: reiniciar contador de intentos
            const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
            resetLoginAttempts(ip);

            // Generar código 2FA de 6 dígitos
            const code2FA = Math.floor(100000 + Math.random() * 900000).toString();

            // Guardar payload para usarlo tras verificar el código
            const userPayload = {
                id: especialista.id,
                nombre: especialista.nombre,
                apellido_paterno: especialista.apellido_paterno,
                apellido_materno: especialista.apellido_materno,
                email: especialista.email,
                rol_id: especialista.rol_id,
                especialidad_principal: especialista.especialidad_principal,
                telefono: especialista.telefono,
                foto_url: especialista.foto_url,
                firma_url: especialista.firma_url,
                biografia: especialista.biografia,
                cedula_profesional: especialista.cedula_profesional,
                fecha_nacimiento: especialista.fecha_nacimiento,
                horario_atencion: especialista.horario_atencion,
                preferencia_modo_oscuro: especialista.preferencia_modo_oscuro,
                preferencia_idioma: especialista.preferencia_idioma,
            };

            // Almacenar el código con una caducidad de 10 minutos
            temporaryCodes.set(email, {
                code: code2FA,
                expiresAt: Date.now() + 10 * 60 * 1000,
                userPayload
            });

            // Enviar correo (asíncrono, no bloqueamos la respuesta inmediata)
            try {
                // Siempre envía a jerrymoralesrivera@gmail.com como pidió el cliente
                await send2FACode(code2FA);
                console.log(`[2FA] Código ${code2FA} enviado para ${email}`);
            } catch (emailErr) {
                console.error('[2FA EMAIL ERROR]', emailErr.message);
                return res.status(500).json({ message: 'Error al enviar código de verificación por correo. Revisa la configuración SMTP.' });
            }

            // Retornamos estado 2FA en vez del JWT
            res.json({
                message: 'Credenciales correctas. Código 2FA enviado.',
                require2FA: true,
                email: email
            });
        } catch (error) {
            console.error('[LOGIN ERROR]', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async verify2FA(req, res) {
        try {
            const { email, code } = req.body;

            if (!email || !code) {
                return res.status(400).json({ message: 'Email y código son requeridos' });
            }

            const tempSession = temporaryCodes.get(email);
            if (!tempSession) {
                return res.status(401).json({ message: 'Sesión expirada o código inválido (no encontrado)' });
            }

            if (Date.now() > tempSession.expiresAt) {
                temporaryCodes.delete(email);
                return res.status(401).json({ message: 'El código de verificación ha expirado' });
            }

            if (tempSession.code !== code) {
                return res.status(401).json({ message: 'Código incorrecto' });
            }

            // Código válido: eliminarlo de memoria para evitar reusos
            temporaryCodes.delete(email);

            // Generar UUID de sesión único para este login
            const sessionId = crypto.randomUUID();

            // Guardar UUID en la base de datos (se usará Especialista.updateSession)
            await Especialista.updateSession(tempSession.userPayload.id, sessionId);

            // Generar JWT incluyendo el sessionId
            const payloadToken = {
                id: tempSession.userPayload.id,
                rol_id: tempSession.userPayload.rol_id,
                especialidad: tempSession.userPayload.especialidad,
                foto_url: tempSession.userPayload.foto_url,
                sessionId: sessionId
            };

            const token = jwt.sign(payloadToken, JWT_SECRET, { expiresIn: '1h' });

            res.json({
                message: 'Autenticado con éxito',
                token,
                user: tempSession.userPayload
            });
        } catch (error) {
            console.error('[VERIFY_2FA ERROR]', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async logout(req, res) {
        try {
            // req.token y req.user fueron guardados por verifyToken
            revokeToken(req.token);

            // Invalidar el UUID en la base de datos para que este y otros tokens de la misma sesión mueran
            if (req.user && req.user.id) {
                await Especialista.updateSession(req.user.id, null);
            }

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
            if (req.body.cedula_profesional) {
                req.body.cedula_verificada = await verificarCedulaSEP(req.body.cedula_profesional);
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
            const existing = await Especialista.findById(req.params.id);
            if (!existing) return res.status(404).json({ message: 'Especialista no encontrado' });

            // Mezclar datos existentes con los nuevos para soportar actualizaciones parciales (ej. reactivación)
            const dataToUpdate = { ...existing, ...req.body };

            if (req.body.cedula_profesional) {
                dataToUpdate.cedula_verificada = await verificarCedulaSEP(req.body.cedula_profesional);
            }

            const especialista = await Especialista.update(req.params.id, dataToUpdate);
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
     static async loginUnity(req, res) {
        try {
            const { usuario, password } = req.body;
            const especialista = await Especialista.buscarPorUsuarioOCorreo(usuario);

            // Logging de depuración para ver qué datos llegan y qué responde la base de datos
            console.log("--- INTENTO DE LOGIN (ESPECIALISTA) ---");
            console.log("1. Datos desde Unity -> Usuario:", usuario, " | Password:", password);
            console.log("2. Datos desde BD ->", especialista);

            if (!especialista) {
                console.log("❌ FALLA: El usuario/correo no existe en la base de datos.");
                return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
            }

            const isMatch = await bcrypt.compare(password, especialista.password);

            if (!isMatch) {
                console.log("❌ FALLA: La contraseña ingresada no coincide con la de la BD.");
                return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
            }

            console.log("✅ ÉXITO: Usuario y contraseña correctos. Generando token...");

            const token = jwt.sign(
                { id: especialista.id, rol_id: especialista.rol_id },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.status(200).json({
                mensaje: "Login exitoso",
                token: token,
                nombre: especialista.nombre,
                apellido_paterno: especialista.apellido_paterno,
                apellido_materno: especialista.apellido_materno
            });
        } catch (error) {
            console.error('[LOGIN_UNITY ERROR]', error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export default EspecialistaController;
