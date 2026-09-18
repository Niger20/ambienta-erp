import {UserEntity} from "../../entitites/user.entity";
import { UpdateUserDto} from "../../dtos";
import {UserRepository} from "../../repositories/user.repository";
import { PasswordHasher } from "../../services/password-hasher";

export interface UpdateUserUseCase {
    execute( dto: UpdateUserDto ): Promise<UserEntity|null>;
}

export class UpdateUser implements UpdateUserUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher
    ) {}

    execute(dto: UpdateUserDto): Promise<UserEntity|null> {
        const hashedDto = dto.contrasenahash
            ? dto.withHashedPassword(this.passwordHasher.hash(dto.contrasenahash))
            : dto;

        return this.userRepository.update(hashedDto);
    }

}