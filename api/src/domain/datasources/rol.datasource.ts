import { RolEntity } from "../entitites/rol.entity";
import { CreateRolDto, UpdateRolDto } from "../dtos";

export abstract class RolDatasource {

    abstract create(dto: CreateRolDto): Promise<RolEntity>;
    abstract getAll(): Promise<RolEntity[]>;
    abstract getById(id: number): Promise<RolEntity | null>;
    abstract update(dto: UpdateRolDto): Promise<RolEntity | null>;
    abstract delete(id: number): Promise<RolEntity>;
    abstract asignarPermisos(rolid: number, permisoIds: number[]): Promise<RolEntity>;
}
