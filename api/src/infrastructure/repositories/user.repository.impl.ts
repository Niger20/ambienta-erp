import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    LoginUserDto,
    RegisterUserDto,
    UpdateUserDto,
    UserDatasource,
    UserEntity,
    UserRepository
} from "../../domain";

export class UserRepositoryImpl implements UserRepository {

    constructor(private readonly datasource: UserDatasource) {}

    register(createUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.datasource.register(createUserDto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<UserEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<UserEntity | null> {
        return this.datasource.getById(id);
    }

    login(dto: LoginUserDto): Promise<UserEntity | null> {
        return this.datasource.login(dto);
    }

    update(updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
        return this.datasource.update(updateUserDto);
    }

    delete(id: number): Promise<UserEntity> {
        return this.datasource.delete(id);
    }
}
