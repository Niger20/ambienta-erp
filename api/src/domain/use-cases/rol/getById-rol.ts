import { RolEntity } from "../../entitites/rol.entity";
import { RolRepository } from "../../repositories/rol.repository";

export interface GetByIdRolUseCase {
    execute(id: number): Promise<RolEntity | null>;
}

export class GetByIdRol implements GetByIdRolUseCase {

    constructor(private readonly rolRepository: RolRepository) {}

    execute(id: number): Promise<RolEntity | null> {
        return this.rolRepository.getById(id);
    }
}
