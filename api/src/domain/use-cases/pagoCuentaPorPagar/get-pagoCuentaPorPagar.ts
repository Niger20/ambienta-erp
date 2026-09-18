import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { PagoCuentaPorPagarEntity } from "../../entitites/pagoCuentaPorPagar.entity";
import { PagoCuentaPorPagarRepository } from "../../repositories/pagoCuentaPorPagar.repository";

export interface GetPagoCuentaPorPagarUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<PagoCuentaPorPagarEntity>>;
}

export class GetPagoCuentaPorPagar implements GetPagoCuentaPorPagarUseCase {
    constructor(private readonly repository: PagoCuentaPorPagarRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<PagoCuentaPorPagarEntity>> {
        return this.repository.getAll();
    }
}
