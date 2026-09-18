import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { CostoAdicionalCompraEntity } from "../../entitites/costo-adicional-compra.entity";
import { CostoAdicionalCompraRepository } from "../../repositories/costo-adicional-compra.repository";

export interface GetCostoAdicionalCompraUseCase {
    execute(page?: number, limit?: number, compraid?: number): Promise<PaginatedResult<CostoAdicionalCompraEntity>>;
}

export class GetCostoAdicionalCompra implements GetCostoAdicionalCompraUseCase {
    constructor(private readonly repository: CostoAdicionalCompraRepository) {}

    execute(page?: number, limit?: number, compraid?: number): Promise<PaginatedResult<CostoAdicionalCompraEntity>> {
        return this.repository.getAll(page, limit, compraid);
    }
}
