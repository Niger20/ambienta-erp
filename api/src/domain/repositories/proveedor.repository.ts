import { PaginatedResult } from "../dtos/shared/pagination.dto";
import {ProveedorEntity} from "../entitites/proveedor.entity";
import {CreateProveedorDto, UpdateProveedorDto} from "../dtos";


export abstract class ProveedorRepository {

    abstract create( create : CreateProveedorDto): Promise<ProveedorEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<ProveedorEntity>>;
    abstract getById(id: number): Promise<ProveedorEntity|null>;
    abstract update( UpdateProveedorDto : UpdateProveedorDto): Promise<ProveedorEntity|null>;
    abstract delete(id: number): Promise<ProveedorEntity>;

}