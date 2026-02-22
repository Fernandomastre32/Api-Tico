import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

/**
 * Middleware para verificar JWT y establecer sesión segura
 */
export const verifyToken = (req, res, next) => {
    // Buscar en cabecera Authorization (Bearer Token)
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "Acceso denegado: Token requerido" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Acceso denegado: Token inválido" });

    try {
        // Expiración corta ya está configurada en la creación, y se valida acá
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Acceso denegado: Token expirado o inválido" });
    }
};

/**
 * Middleware de Control de Acceso Basado en Roles (RBAC)
 */
export const authorize = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol_id) {
            return res.status(403).json({ message: "Acceso denegado: Falta información de rol" });
        }

        // Comprobar si el rol del usuario está permitido
        if (!rolesPermitidos.includes(req.user.rol_id)) {
            return res.status(403).json({ message: "Acceso denegado: Rol no autorizado" });
        }

        next();
    };
};

/**
 * Middleware para Protección contra IDOR (Insecure Direct Object Reference)
 * Valida que un usuario solo pueda editar/ver sus propios recursos
 * (si no es administrador, por ejemplo)
 */
export const checkOwnerOrAdmin = (req, res, next) => {
    // Suponiendo rol_id 1 es Admin
    if (req.user.rol_id === 1) {
        return next();
    }

    // Si la ruta contiene :id (ej. /api/especialistas/:id) 
    const recursoId = parseInt(req.params.id);
    if (req.user.id !== recursoId) {
        return res.status(403).json({ message: "No autorizado: No puedes modificar/ver recursos de otra persona" });
    }

    next();
};
