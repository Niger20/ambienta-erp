import { UserEntity } from "../../entitites/user.entity";
import { UpdateProfileDto } from "../../dtos";
import { UserRepository } from "../../repositories/user.repository";
import { PasswordHasher } from "../../services/password-hasher";

export interface UpdateProfileUseCase {
    execute(dto: UpdateProfileDto): Promise<UserEntity>;
}

export class UpdateProfile implements UpdateProfileUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
    ) {}

    async execute(dto: UpdateProfileDto): Promise<UserEntity> {
        const values = { ...dto.values };

        if (dto.wantsPasswordChange) {
            const current = await this.userRepository.getById(dto.usuarioid);
            if (!current) throw 'Usuario no encontrado';

            const matches = this.passwordHasher.compare(dto.contrasenaActual!, current.contrasenahash);
            if (!matches) throw 'La contraseña actual no es correcta';

            values.contrasenahash = this.passwordHasher.hash(dto.contrasenaNueva!);
        }

        return this.userRepository.updateProfile(dto.usuarioid, values);
    }
}
