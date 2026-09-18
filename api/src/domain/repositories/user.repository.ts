import { PaginatedResult } from "../dtos/shared/pagination.dto";
import {UserEntity} from "../entitites/user.entity";
import {LoginUserDto, RegisterUserDto, UpdateUserDto} from "../dtos";


export abstract class UserRepository {

    abstract register( createUserDto : RegisterUserDto): Promise<UserEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<UserEntity>>;
    abstract login(dto: LoginUserDto): Promise<UserEntity|null>;
    abstract update( updateUserDto : UpdateUserDto): Promise<UserEntity|null>;
    abstract delete(id: number): Promise<UserEntity>;
    abstract getById(id: number): Promise<UserEntity|null>;

}