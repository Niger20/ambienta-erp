import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import {UserEntity} from "../../entitites/user.entity";
import {UserRepository} from "../../repositories/user.repository";


export interface GetUserUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<UserEntity>>;
}

export class GetUser implements GetUserUseCase {

    constructor(private readonly userRepository: UserRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<UserEntity>> {
        return this.userRepository.getAll(page, limit);
    }

}