import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { CompraProductoEntity } from "../../entitites/compraProducto.entity";
import { CompraProductoRepository } from "../../repositories/compraProducto.repository";

export interface GetCompraProductoUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<CompraProductoEntity>>;
}

export class GetCompraProducto implements GetCompraProductoUseCase {
    constructor(private readonly repository: CompraProductoRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<CompraProductoEntity>> {
        return this.repository.getAll();
    }
}
