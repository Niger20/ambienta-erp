import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import {ProveedorEntity} from "../../entitites/proveedor.entity";
import {ProveedorRepository} from "../../repositories/proveedor.repository";


export interface GetProveedorUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<ProveedorEntity>>;
}

export class GetProveedor implements GetProveedorUseCase {

    constructor(private readonly proveedorRepository: ProveedorRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<ProveedorEntity>> {
        return this.proveedorRepository.getAll(page, limit);
    }

}