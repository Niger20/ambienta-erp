import { PermisoEntity } from "../entitites/permiso.entity";

export abstract class PermisoRepository {
    abstract getAll(): Promise<PermisoEntity[]>;
}
