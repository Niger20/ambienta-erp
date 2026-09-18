import { UserEntity } from "../../entitites/user.entity";
import { AdminRegisterUserDto } from "../../dtos";
import { UserRepository } from "../../repositories/user.repository";
import { PasswordHasher } from "../../services/password-hasher";

export interface AdminRegisterUserUseCase {
    execute( dto: AdminRegisterUserDto ): Promise<UserEntity>;
}

/** Alta de usuario POR UN ADMINISTRADOR — permite fijar el rol explícitamente. */
export class AdminRegisterUser implements AdminRegisterUserUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
    ) {}

    execute(dto: AdminRegisterUserDto): Promise<UserEntity> {
        const hashedPassword = this.passwordHasher.hash(dto.contrasenahash);
        return this.userRepository.adminRegister(dto.withHashedPassword(hashedPassword));
    }
}
