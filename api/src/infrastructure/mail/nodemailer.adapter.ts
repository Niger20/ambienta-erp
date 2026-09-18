import nodemailer, { Transporter } from 'nodemailer';
import { envs } from '../../config/envs';
import { EmailSender } from '../../domain';

/**
 * Envía correo real vía SMTP si SMTP_HOST está configurado en .env.
 * Si no, hace fallback a modo desarrollo: imprime el correo en consola
 * (asunto + link) para poder probar el flujo de verificación sin credenciales reales.
 */
export class NodemailerAdapter implements EmailSender {

    private transporter: Transporter | null = null;

    constructor() {
        if (envs.SMTP_HOST) {
            this.transporter = nodemailer.createTransport({
                host: envs.SMTP_HOST,
                port: envs.SMTP_PORT,
                secure: envs.SMTP_PORT === 465,
                auth: envs.SMTP_USER ? { user: envs.SMTP_USER, pass: envs.SMTP_PASS } : undefined,
            });
        }
    }

    async send(to: string, subject: string, html: string): Promise<void> {
        if (!this.transporter) {
            console.log('\n──── [MODO DEV] Correo no enviado (SMTP no configurado) ────');
            console.log(`Para: ${to}`);
            console.log(`Asunto: ${subject}`);
            console.log(html.replace(/<[^>]+>/g, ' ').trim());
            console.log('─────────────────────────────────────────────────────────\n');
            return;
        }

        await this.transporter.sendMail({
            from: envs.SMTP_FROM,
            to,
            subject,
            html,
        });
    }
}
