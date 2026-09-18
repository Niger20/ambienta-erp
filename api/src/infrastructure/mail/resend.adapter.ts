import { envs } from '../../config/envs';
import { EmailSender } from '../../domain';

/**
 * Envía correo vía la API HTTP de Resend (https://resend.com). A diferencia de
 * SMTP, no depende de un puerto de socket saliente — funciona en hostings que
 * bloquean SMTP (como Railway).
 */
export class ResendAdapter implements EmailSender {

    async send(to: string, subject: string, html: string): Promise<void> {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${envs.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: envs.RESEND_FROM,
                to: [to],
                subject,
                html,
            }),
        });

        if (!res.ok) {
            const body = await res.text().catch(() => '');
            throw new Error(`Resend respondió ${res.status}: ${body}`);
        }
    }
}
