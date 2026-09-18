import { PermisoEntity } from "../../entitites/permiso.entity";
import { PermisoRepository } from "../../repositories/permiso.repository";

export interface GetPermisosUseCase {
    execute(): Promise<PermisoEntity[]>;
}

export class GetPermisos implements GetPermisosUseCase {

    constructor(private readonly permisoRepository: PermisoRepository) {}

    execute(): Promise<PermisoEntity[]> {
        return this.permisoRepository.getAll();
    }
}
