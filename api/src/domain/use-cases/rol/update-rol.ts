import { RolEntity } from "../../entitites/rol.entity";
import { UpdateRolDto } from "../../dtos";
import { RolRepository } from "../../repositories/rol.repository";

export interface UpdateRolUseCase {
    execute(dto: UpdateRolDto): Promise<RolEntity | null>;
}

export class UpdateRol implements UpdateRolUseCase {

    constructor(private readonly rolRepository: RolRepository) {}

    async execute(dto: UpdateRolDto): Promise<RolEntity | null> {
        const rol = await this.rolRepository.getById(dto.id);
        if (!rol) throw 'Rol no encontrado';
        if (rol.essistema) throw 'Los roles de sistema (administrador, empleado, invitado) no se pueden editar';

        return this.rolRepository.update(dto);
    }
}
