import { UserRepository } from "../../repositories/user.repository";

export interface LogoutUserUseCase {
    execute(jti: string): Promise<void>;
}

/** Revoca el token de sesión (jti) actual — cierre de sesión real, server-side. */
export class LogoutUser implements LogoutUserUseCase {

    constructor(private readonly userRepository: UserRepository) {}

    execute(jti: string): Promise<void> {
        return this.userRepository.revokeTokenSesion(jti);
    }
}
