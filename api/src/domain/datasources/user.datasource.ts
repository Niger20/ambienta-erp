import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { UserEntity } from "../entitites/user.entity";
import { AdminRegisterUserDto, LoginUserDto, RegisterUserDto, UpdateUserDto } from "../dtos";

export interface VerificationTokenRecord {
    usuarioid: number;
    tipo: string;
    expiracion: Date;
    usado: boolean;
}

export abstract class UserDatasource {

    abstract register( create : RegisterUserDto): Promise<UserEntity>;
    abstract adminRegister( create : AdminRegisterUserDto): Promise<UserEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<UserEntity>>;
    abstract getById(id: number): Promise<UserEntity>;
    abstract getByCorreo(correo: string): Promise<UserEntity | null>;
    abstract login(dto: LoginUserDto): Promise<UserEntity|null>;
    abstract update( UpdateClienteDto : UpdateUserDto): Promise<UserEntity|null>;
    abstract updateProfile(usuarioid: number, values: { [key: string]: any }): Promise<UserEntity>;
    abstract delete(id: number): Promise<UserEntity>;

    abstract getPermisosDeRol(rolid: number | null): Promise<string[]>;

    abstract createVerificationToken(usuarioid: number, token: string, tipo: string, expiracion: Date): Promise<void>;
    abstract findVerificationToken(token: string): Promise<VerificationTokenRecord | null>;
    abstract markVerificationTokenUsed(token: string): Promise<void>;
    abstract markEmailVerified(usuarioid: number): Promise<void>;
    abstract invalidatePendingVerificationTokens(usuarioid: number, tipo: string): Promise<void>;

    abstract createTokenSesion(usuarioid: number, jti: string, fechaexpira: Date): Promise<void>;
    abstract isTokenSesionValid(jti: string): Promise<boolean>;
    abstract revokeTokenSesion(jti: string): Promise<void>;
}
