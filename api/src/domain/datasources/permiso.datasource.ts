import { PermisoEntity } from "../entitites/permiso.entity";

export abstract class PermisoDatasource {
    abstract getAll(): Promise<PermisoEntity[]>;
}
