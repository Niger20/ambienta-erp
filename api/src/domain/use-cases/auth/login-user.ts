import { UserEntity } from "../../entitites/user.entity";
import { LoginUserDto } from "../../dtos";
import { UserRepository } from "../../repositories/user.repository";
import { PasswordHasher } from "../../services/password-hasher";
import { TokenSigner } from "../../services/token-signer";

export interface LoginUserResult {
    user: UserEntity;
    token: string;
}

export interface LoginUserUseCase {
    execute(dto: LoginUserDto): Promise<LoginUserResult | null>;
}

export class LoginUser implements LoginUserUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenSigner: TokenSigner
    ) {}

    async execute(dto: LoginUserDto): Promise<LoginUserResult | null> {
        const user = await this.userRepository.login(dto);
        if (!user) return null;

        const matches = this.passwordHasher.compare(dto.contrasena, user.contrasenahash);
        if (!matches) throw 'Credenciales invalidas';

        const token = this.tokenSigner.generate({
            id: user.id,
            nombreusuario: user.nombreusuario,
            rol: user.rol
        });

        return { user, token };
    }

}