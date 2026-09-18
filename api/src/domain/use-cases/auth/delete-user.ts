import {UserEntity} from "../../entitites/user.entity";
import {UserRepository} from "../../repositories/user.repository";


export interface DeleteUserUseCase {
    execute( id: number ): Promise<UserEntity>;
}

export class DeleteUser implements DeleteUserUseCase {

    constructor(private readonly userRepository: UserRepository) {}

    execute( id: number): Promise<UserEntity> {
        return this.userRepository.delete(id);
    }

}