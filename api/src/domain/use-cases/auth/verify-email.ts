import { UserRepository } from "../../repositories/user.repository";

export interface VerifyEmailUseCase {
    execute(token: string): Promise<void>;
}

export class VerifyEmail implements VerifyEmailUseCase {

    constructor(private readonly userRepository: UserRepository) {}

    async execute(token: string): Promise<void> {
        const record = await this.userRepository.findVerificationToken(token);
        if (!record) throw 'Token de verificación inválido';
        if (record.usado) throw 'Este enlace de verificación ya fue utilizado';
        if (record.expiracion.getTime() < Date.now()) throw 'El enlace de verificación expiró';

        await this.userRepository.markEmailVerified(record.usuarioid);
        await this.userRepository.markVerificationTokenUsed(token);
    }
}
