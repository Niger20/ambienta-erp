import {UserEntity} from "../../entitites/user.entity";
import {UserRepository} from "../../repositories/user.repository";


export interface GetByIdUserUseCase {
    execute( id : Number ): Promise<UserEntity|null>;
}

export class GetByIdUser implements GetByIdUserUseCase {

    constructor(private readonly userRepository: UserRepository) {}

    execute( id : number): Promise<UserEntity|null> {
        return this.userRepository.getById(id);
    }

}