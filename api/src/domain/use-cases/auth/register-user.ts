import { randomBytes } from 'node:crypto';
import { UserEntity } from "../../entitites/user.entity";
import { RegisterUserDto } from "../../dtos";
import { UserRepository } from "../../repositories/user.repository";
import { PasswordHasher } from "../../services/password-hasher";
import { EmailSender } from "../../services/email-sender";

const TOKEN_TTL_HOURS = 24;

export interface RegisterUserUseCase {
    execute( dto: RegisterUserDto ): Promise<UserEntity>;
}

/**
 * Registro PÚBLICO (self-signup). Crea el usuario con rol "invitado" (lo decide el
 * datasource) y dispara la verificación de correo por token: si hay SMTP configurado
 * se envía un correo real, si no, el link queda documentado en consola (modo dev).
 */
export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly emailSender: EmailSender,
        private readonly appBaseUrl: string,
    ) {}

    async execute(dto: RegisterUserDto): Promise<UserEntity> {
        const hashedPassword = this.passwordHasher.hash(dto.contrasenahash);
        const hashedDto = dto.withHashedPassword(hashedPassword);
        const user = await this.userRepository.register(hashedDto);

        const token = randomBytes(32).toString('hex');
        const expiracion = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);
        await this.userRepository.createVerificationToken(user.id, token, 'verificacion_correo', expiracion);

        const link = `${this.appBaseUrl}/verificar-correo/${token}`;

        // La cuenta ya quedó creada arriba: un fallo de SMTP (timeout, host caído,
        // proveedor bloqueando el puerto, etc.) NO debe tumbar el registro. Se
        // registra el error y el usuario puede pedir el reenvío desde su perfil.
        try {
            await this.emailSender.send(
                dto.correo,
                'Verifica tu correo — Ambienta ERP',
                `<p>Hola ${dto.nombre},</p><p>Confirma tu correo para activar tu cuenta en Ambienta ERP:</p><p><a href="${link}">${link}</a></p><p>Este enlace expira en ${TOKEN_TTL_HOURS} horas.</p>`,
            );
        } catch (error) {
            console.error('[RegisterUser] No se pudo enviar el correo de verificación:', error);
        }

        return user;
    }
}
