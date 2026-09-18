import { randomBytes } from 'node:crypto';
import { UserRepository } from "../../repositories/user.repository";
import { EmailSender } from "../../services/email-sender";

const TOKEN_TTL_HOURS = 24;

export interface ResendVerificationUseCase {
    execute(usuarioid: number): Promise<void>;
}

export class ResendVerification implements ResendVerificationUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailSender: EmailSender,
        private readonly appBaseUrl: string,
    ) {}

    async execute(usuarioid: number): Promise<void> {
        const user = await this.userRepository.getById(usuarioid);
        if (!user) throw 'Usuario no encontrado';
        if (!user.correo) throw 'Tu cuenta no tiene un correo registrado';
        if (user.correoverificado) throw 'Tu correo ya está verificado';

        await this.userRepository.invalidatePendingVerificationTokens(usuarioid, 'verificacion_correo');

        const token = randomBytes(32).toString('hex');
        const expiracion = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);
        await this.userRepository.createVerificationToken(usuarioid, token, 'verificacion_correo', expiracion);

        const link = `${this.appBaseUrl}/verificar-correo/${token}`;
        await this.emailSender.send(
            user.correo,
            'Verifica tu correo — Ambienta ERP',
            `<p>Hola ${user.nombre ?? user.nombreusuario},</p><p>Confirma tu correo para activar tu cuenta:</p><p><a href="${link}">${link}</a></p><p>Este enlace expira en ${TOKEN_TTL_HOURS} horas.</p>`,
        );
    }
}
