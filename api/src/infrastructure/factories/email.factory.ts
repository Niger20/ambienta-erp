import { envs } from '../../config/envs';
import { EmailSender } from '../../domain';
import { ResendAdapter } from '../mail/resend.adapter';
import { NodemailerAdapter } from '../mail/nodemailer.adapter';

/**
 * Resend (HTTP) > SMTP > modo consola (dev), en ese orden de prioridad.
 * Resend es la opción recomendada en producción porque no depende de un
 * puerto SMTP saliente, que varios hostings (Railway incluido) bloquean.
 */
export const buildEmailSender = (): EmailSender => {
    if (envs.RESEND_API_KEY) return new ResendAdapter();
    return new NodemailerAdapter();
};
