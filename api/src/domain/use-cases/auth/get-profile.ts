import { UserEntity } from "../../entitites/user.entity";
import { UserRepository } from "../../repositories/user.repository";

export interface GetProfileUseCase {
    execute(usuarioid: number): Promise<UserEntity | null>;
}

export class GetProfile implements GetProfileUseCase {

    constructor(private readonly userRepository: UserRepository) {}

    execute(usuarioid: number): Promise<UserEntity | null> {
        return this.userRepository.getById(usuarioid);
    }
}
