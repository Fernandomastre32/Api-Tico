import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../config/db.js';
dotenv.config();

// 🔐 JWT_SECRET OBLIGATORIO
if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL: JWT_SECRET no está definido en las variables de entorno. La aplicación no puede iniciar de forma segura.');
    process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
const revokedTokens = new Set();

export const revokeToken = (token) => {
    revokedTokens.add(token);
};

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Acceso denegado: Token requerido' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado: Formato de token inválido. Usa Bearer <token>' });
        }

        if (revokedTokens.has(token)) {
            return res.status(401).json({ message: 'Acceso denegado: Token revocado. Inicia sesión nuevamente' });
        }

        // Decodificamos el token
        const verified = jwt.verify(token, JWT_SECRET);

        // --- LÓGICA ESPECIAL PARA UNITY (TUTORES) ---
        // Si el token dice que es de tipo 'tutor', lo dejamos pasar más fácilmente
        // porque la API de Unity es más ligera y no usa session_token en DB
        if (verified.type === 'tutor') {
            if (!verified.uuid) {
                return res.status(401).json({ message: 'Token de Unity obsoleto. Inicia sesión nuevamente en el juego.' });
            }
            req.user = verified;
            req.token = token;
            return next();
        }

        // --- LÓGICA ESTRICTA PARA EL PANEL WEB (ESPECIALISTAS) ---
        if (!verified.sessionId) {
            return res.status(401).json({ message: 'La sesión es antigua o inválida. Seguridad de Token UUID requerida. Inicia sesión nuevamente.' });
        }

        let activeSessionToken = null;
        try {
            const { rowCount, rows } = await pool.query('SELECT session_token FROM especialistas WHERE id = $1', [verified.id]);
            if (rowCount > 0) {
                activeSessionToken = rows[0].session_token;
            }
        } catch (dbErr) {
            if (dbErr.code === '42703') {
                console.warn('[AUTH] Saltando verificación de sesión: columna session_token no existe en DB.');
                req.user = verified;
                req.token = token;
                return next();
            }
            throw dbErr;
        }

        if (activeSessionToken && activeSessionToken !== verified.sessionId) {
            return res.status(401).json({ message: 'Acceso denegado: Sesión invalidada. Inicia sesión nuevamente' });
        }

        req.user = verified;
        req.token = token;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Acceso denegado: Token expirado. Inicia sesión nuevamente' });
        }
        return res.status(401).json({ message: 'Acceso denegado: Token inválido' });
    }
};

export const authorize = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol_id) {
            return res.status(403).json({ message: 'Acceso denegado: Falta información de rol' });
        }

        if (!rolesPermitidos.includes(req.user.rol_id)) {
            return res.status(403).json({ message: 'Acceso denegado: No tienes permisos suficientes para esta acción' });
        }
        next();
    };
};

export const checkOwnerOrAdmin = (req, res, next) => {
    if (req.user.rol_id === 1) {
        return next();
    }

    const recursoId = parseInt(req.params.id);
    if (req.user.id !== recursoId) {
        return res.status(403).json({ message: 'Acceso denegado: No puedes modificar recursos de otro usuario' });
    }
    next();
};