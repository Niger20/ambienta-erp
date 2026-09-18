import { RolEntity } from "../../entitites/rol.entity";
import { RolRepository } from "../../repositories/rol.repository";

export interface GetRolesUseCase {
    execute(): Promise<RolEntity[]>;
}

export class GetRoles implements GetRolesUseCase {

    constructor(private readonly rolRepository: RolRepository) {}

    execute(): Promise<RolEntity[]> {
        return this.rolRepository.getAll();
    }
}
