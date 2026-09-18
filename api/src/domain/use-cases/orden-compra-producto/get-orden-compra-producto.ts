import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { OrdenCompraProductoEntity } from "../../entitites/orden-compra-producto.entity";
import { OrdenCompraProductoRepository } from "../../repositories/orden-compra-producto.repository";

export interface GetOrdenCompraProductoUseCase {
    execute(page?: number, limit?: number, ordencompraid?: number): Promise<PaginatedResult<OrdenCompraProductoEntity>>;
}

export class GetOrdenCompraProducto implements GetOrdenCompraProductoUseCase {
    constructor(private readonly repository: OrdenCompraProductoRepository) {}

    execute(page?: number, limit?: number, ordencompraid?: number): Promise<PaginatedResult<OrdenCompraProductoEntity>> {
        return this.repository.getAll(page, limit, ordencompraid);
    }
}
