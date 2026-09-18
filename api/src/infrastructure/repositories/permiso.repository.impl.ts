import { PermisoDatasource, PermisoEntity, PermisoRepository } from "../../domain";

export class PermisoRepositoryImpl implements PermisoRepository {

    constructor(private readonly datasource: PermisoDatasource) {}

    getAll(): Promise<PermisoEntity[]> {
        return this.datasource.getAll();
    }
}
