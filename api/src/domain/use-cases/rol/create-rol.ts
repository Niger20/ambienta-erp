import { RolEntity } from "../../entitites/rol.entity";
import { CreateRolDto } from "../../dtos";
import { RolRepository } from "../../repositories/rol.repository";

export interface CreateRolUseCase {
    execute(dto: CreateRolDto): Promise<RolEntity>;
}

export class CreateRol implements CreateRolUseCase {

    constructor(private readonly rolRepository: RolRepository) {}

    execute(dto: CreateRolDto): Promise<RolEntity> {
        return this.rolRepository.create(dto);
    }
}
