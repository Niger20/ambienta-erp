import cors from 'cors';
import { envs } from '../../config/envs';

// Orígenes de desarrollo local: siempre permitidos, no cambian entre despliegues.
const LOCAL_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
];

// Orígenes de producción (Railway, dominio propio, etc.): se configuran por
// entorno con ALLOWED_ORIGINS (separados por coma) — nunca hardcodeados aquí,
// para poder corregir/agregar un dominio sin tocar código ni volver a compilar.
const extraOrigins = envs.ALLOWED_ORIGINS
    ? envs.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : [];

const ALLOWED_ORIGINS = [...LOCAL_ORIGINS, ...extraOrigins];

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
