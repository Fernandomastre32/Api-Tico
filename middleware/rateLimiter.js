/**
 * Rate Limiter — Login Brute Force Protection
 * Implementación en memoria (Map) sin dependencias externas.
 * Máximo: 5 intentos por IP cada 15 minutos.
 */

const loginAttempts = new Map(); // IP -> { count, firstAttemptAt }

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos en milisegundos

export const loginRateLimiter = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();

    const record = loginAttempts.get(ip);

    if (record) {
        const elapsed = now - record.firstAttemptAt;

        // Si pasaron los 15 minutos, reiniciar ventana
        if (elapsed > WINDOW_MS) {
            loginAttempts.set(ip, { count: 1, firstAttemptAt: now });
            return next();
        }

        // Dentro de la ventana: verificar límite
        if (record.count >= MAX_ATTEMPTS) {
            const retryAfterSec = Math.ceil((WINDOW_MS - elapsed) / 1000);
            return res.status(429).json({
                message: `Demasiados intentos de inicio de sesión. Intenta de nuevo en ${Math.ceil(retryAfterSec / 60)} minuto(s).`,
                retryAfterSeconds: retryAfterSec
            });
        }

        // Incrementar contador
        record.count += 1;
        loginAttempts.set(ip, record);
    } else {
        // Primera vez que vemos esta IP
        loginAttempts.set(ip, { count: 1, firstAttemptAt: now });
    }

    next();
};

/**
 * Resetear intentos de una IP al autenticarse exitosamente.
 * Se llama desde el controller al confirmar credenciales correctas.
 */
export const resetLoginAttempts = (ip) => {
    loginAttempts.delete(ip);
};

// Limpieza automática cada hora para evitar fugas de memoria
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of loginAttempts.entries()) {
        if (now - record.firstAttemptAt > WINDOW_MS) {
            loginAttempts.delete(ip);
        }
    }
}, 60 * 60 * 1000);
