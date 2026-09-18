import rateLimit from 'express-rate-limit';

export class RateLimitAdapter {

    // Rate limit global: máx 100 peticiones por IP cada 1 minuto
    static get globalLimiter() {
        return rateLimit({
            windowMs: 60 * 1000,
            max: 200,
            standardHeaders: true,
            legacyHeaders: false,
            message: { error: 'Demasiadas peticiones. Por favor intenta más tarde.' },
        });
    }

    // Rate limit estricto para login: máx 10 intentos por IP cada 15 minutos
    static get authLimiter() {
        return rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 10,
            standardHeaders: true,
            legacyHeaders: false,
            message: { error: 'Demasiados intentos de inicio de sesión. Intenta en 15 minutos.' },
        });
    }

}
