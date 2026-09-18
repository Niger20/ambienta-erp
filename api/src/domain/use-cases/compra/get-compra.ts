import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { CompraEntity } from "../../entitites/compra.entity";
import { CompraRepository } from "../../repositories/compra.repository";

export interface GetCompraUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<CompraEntity>>;
}

export class GetCompra implements GetCompraUseCase {
    constructor(private readonly repository: CompraRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<CompraEntity>> {
        return this.repository.getAll(page, limit);
    }
}
