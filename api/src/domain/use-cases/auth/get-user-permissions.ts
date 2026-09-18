import { UserRepository } from "../../repositories/user.repository";

export interface GetUserPermissionsUseCase {
    execute(rolid: number | null): Promise<string[]>;
}

export class GetUserPermissions implements GetUserPermissionsUseCase {

    constructor(private readonly userRepository: UserRepository) {}

    execute(rolid: number | null): Promise<string[]> {
        return this.userRepository.getPermisosDeRol(rolid);
    }
}
