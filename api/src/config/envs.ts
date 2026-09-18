import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),

    JWT_SEED: get('JWT_SEED').required().asString(),

    APP_BASE_URL: get('APP_BASE_URL').default('http://localhost:5173').asString(),

    // Orígenes adicionales permitidos por CORS, separados por coma (p.ej. la URL
    // de producción en Railway). Los orígenes de desarrollo local siempre están
    // permitidos (ver cors.adapter.ts); esto es solo para lo que no es localhost.
    ALLOWED_ORIGINS: get('ALLOWED_ORIGINS').default('').asString(),

    SMTP_HOST: get('SMTP_HOST').default('').asString(),
    SMTP_PORT: get('SMTP_PORT').default('587').asPortNumber(),
    SMTP_USER: get('SMTP_USER').default('').asString(),
    SMTP_PASS: get('SMTP_PASS').default('').asString(),
    SMTP_FROM: get('SMTP_FROM').default('Ambienta ERP <no-reply@ambienta.local>').asString(),

}