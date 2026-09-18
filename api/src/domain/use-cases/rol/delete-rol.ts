import { RolEntity } from "../../entitites/rol.entity";
import { RolRepository } from "../../repositories/rol.repository";

export interface DeleteRolUseCase {
    execute(id: number): Promise<RolEntity>;
}

export class DeleteRol implements DeleteRolUseCase {

    constructor(private readonly rolRepository: RolRepository) {}

    async execute(id: number): Promise<RolEntity> {
        const rol = await this.rolRepository.getById(id);
        if (!rol) throw 'Rol no encontrado';
        if (rol.essistema) throw 'Los roles de sistema (administrador, empleado, invitado) no se pueden eliminar';

        return this.rolRepository.delete(id);
    }
}
