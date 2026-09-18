import { RolEntity } from "../../entitites/rol.entity";
import { AsignarPermisosDto } from "../../dtos";
import { RolRepository } from "../../repositories/rol.repository";

export interface AsignarPermisosUseCase {
    execute(dto: AsignarPermisosDto): Promise<RolEntity>;
}

export class AsignarPermisos implements AsignarPermisosUseCase {

    constructor(private readonly rolRepository: RolRepository) {}

    execute(dto: AsignarPermisosDto): Promise<RolEntity> {
        return this.rolRepository.asignarPermisos(dto.rolid, dto.permisoIds);
    }
}
