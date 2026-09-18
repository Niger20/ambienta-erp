import cors from 'cors';

// Orígenes permitidos: añade aquí tu dominio de producción cuando lo tengas
const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    'https://ambientapos-production.up.railway.app'
];

// Permitir inyectar más orígenes desde las variables de entorno de Railway
if (process.env.ALLOWED_ORIGINS) {
    const extraOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    ALLOWED_ORIGINS.push(...extraOrigins);
}

export class CorsAdapter {

    static get middleware() {
        const options: cors.CorsOptions = {
            origin: (origin, callback) => {
                // Permitir peticiones sin origin (ej: Postman, curl, apps móviles en dev)
                if (!origin) return callback(null, true);
                if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
                callback(new Error(`CORS: origin '${origin}' no permitido`));
            },
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        };

        return cors(options);
    }

}
