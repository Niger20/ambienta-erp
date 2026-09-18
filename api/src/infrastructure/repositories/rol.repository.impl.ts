import { CreateRolDto, RolDatasource, RolEntity, RolRepository, UpdateRolDto } from "../../domain";

export class RolRepositoryImpl implements RolRepository {

    constructor(private readonly datasource: RolDatasource) {}

    create(dto: CreateRolDto): Promise<RolEntity> {
        return this.datasource.create(dto);
    }

    getAll(): Promise<RolEntity[]> {
        return this.datasource.getAll();
    }

    getById(id: number): Promise<RolEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateRolDto): Promise<RolEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<RolEntity> {
        return this.datasource.delete(id);
    }

    asignarPermisos(rolid: number, permisoIds: number[]): Promise<RolEntity> {
        return this.datasource.asignarPermisos(rolid, permisoIds);
    }
}
