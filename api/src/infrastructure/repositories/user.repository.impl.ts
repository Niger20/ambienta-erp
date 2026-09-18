import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    AdminRegisterUserDto,
    LoginUserDto,
    RegisterUserDto,
    UpdateUserDto,
    UserDatasource,
    UserEntity,
    UserRepository,
    VerificationTokenRecord,
} from "../../domain";

export class UserRepositoryImpl implements UserRepository {

    constructor(private readonly datasource: UserDatasource) {}

    register(createUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.datasource.register(createUserDto);
    }

    adminRegister(createUserDto: AdminRegisterUserDto): Promise<UserEntity> {
        return this.datasource.adminRegister(createUserDto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<UserEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<UserEntity | null> {
        return this.datasource.getById(id);
    }

    getByCorreo(correo: string): Promise<UserEntity | null> {
        return this.datasource.getByCorreo(correo);
    }

    login(dto: LoginUserDto): Promise<UserEntity | null> {
        return this.datasource.login(dto);
    }

    update(updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
        return this.datasource.update(updateUserDto);
    }

    updateProfile(usuarioid: number, values: { [key: string]: any }): Promise<UserEntity> {
        return this.datasource.updateProfile(usuarioid, values);
    }

    delete(id: number): Promise<UserEntity> {
        return this.datasource.delete(id);
    }

    getPermisosDeRol(rolid: number | null): Promise<string[]> {
        return this.datasource.getPermisosDeRol(rolid);
    }

    createVerificationToken(usuarioid: number, token: string, tipo: string, expiracion: Date): Promise<void> {
        return this.datasource.createVerificationToken(usuarioid, token, tipo, expiracion);
    }

    findVerificationToken(token: string): Promise<VerificationTokenRecord | null> {
        return this.datasource.findVerificationToken(token);
    }

    markVerificationTokenUsed(token: string): Promise<void> {
        return this.datasource.markVerificationTokenUsed(token);
    }

    markEmailVerified(usuarioid: number): Promise<void> {
        return this.datasource.markEmailVerified(usuarioid);
    }

    invalidatePendingVerificationTokens(usuarioid: number, tipo: string): Promise<void> {
        return this.datasource.invalidatePendingVerificationTokens(usuarioid, tipo);
    }

    createTokenSesion(usuarioid: number, jti: string, fechaexpira: Date): Promise<void> {
        return this.datasource.createTokenSesion(usuarioid, jti, fechaexpira);
    }

    isTokenSesionValid(jti: string): Promise<boolean> {
        return this.datasource.isTokenSesionValid(jti);
    }

    revokeTokenSesion(jti: string): Promise<void> {
        return this.datasource.revokeTokenSesion(jti);
    }
}
