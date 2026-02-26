import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// 🔐 JWT_SECRET OBLIGATORIO — Si no está en .env, la app no debe arrancar
if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL: JWT_SECRET no está definido en las variables de entorno. La aplicación no puede iniciar de forma segura.');
    process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Blacklist de tokens revocados (logout).
 * En producción real, se recomienda usar Redis para persistencia.
 * Este Set en memoria se limpia automáticamente al reiniciar el servidor.
 */
const revokedTokens = new Set();

/**
 * Revoca un token (usado por logout).
 */
export const revokeToken = (token) => {
    revokedTokens.add(token);
};

/**
 * Middleware para verificar JWT y establecer sesión segura.
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado: Token requerido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: Formato de token inválido. Usa Bearer <token>' });
    }

    // Verificar si el token fue revocado (logout previo)
    if (revokedTokens.has(token)) {
        return res.status(401).json({ message: 'Acceso denegado: Token revocado. Inicia sesión nuevamente' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        req.token = token; // Guardamos el token para poder revocarlo en logout
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Acceso denegado: Token expirado. Inicia sesión nuevamente' });
        }
        return res.status(401).json({ message: 'Acceso denegado: Token inválido' });
    }
};

/**
 * Middleware de Control de Acceso Basado en Roles (RBAC).
 */
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

/**
 * Middleware de Protección contra IDOR.
 * Valida que un usuario solo pueda editar/ver sus propios recursos
 * salvo que sea administrador (rol_id = 1).
 */
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
