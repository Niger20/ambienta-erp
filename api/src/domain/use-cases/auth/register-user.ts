import {UserEntity} from "../../entitites/user.entity";
import {RegisterUserDto} from "../../dtos";
import {UserRepository} from "../../repositories/user.repository";
import {PasswordHasher} from "../../services/password-hasher";


export interface RegisterUserUseCase {
    execute( dto: RegisterUserDto ): Promise<UserEntity>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher
    ) {}

    execute(dto: RegisterUserDto): Promise<UserEntity> {
        const hashedPassword = this.passwordHasher.hash(dto.contrasenahash);
        const hashedDto = dto.withHashedPassword(hashedPassword);
        return this.userRepository.register(hashedDto);
    }

}