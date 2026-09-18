import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { OrdenCompraEntity } from "../../entitites/orden-compra.entity";
import { OrdenCompraRepository } from "../../repositories/orden-compra.repository";

export interface GetOrdenCompraUseCase {
    execute(page?: number, limit?: number, proveedorid?: number, estado?: string): Promise<PaginatedResult<OrdenCompraEntity>>;
}

export class GetOrdenCompra implements GetOrdenCompraUseCase {
    constructor(private readonly repository: OrdenCompraRepository) {}

    execute(page?: number, limit?: number, proveedorid?: number, estado?: string): Promise<PaginatedResult<OrdenCompraEntity>> {
        return this.repository.getAll(page, limit, proveedorid, estado);
    }
}
