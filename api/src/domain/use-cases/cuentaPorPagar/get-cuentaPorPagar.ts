import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { CuentaPorPagarEntity } from "../../entitites/cuentaPorPagar.entity";
import { CuentaPorPagarRepository } from "../../repositories/cuentaPorPagar.repository";

export interface GetCuentaPorPagarUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<CuentaPorPagarEntity>>;
}

export class GetCuentaPorPagar implements GetCuentaPorPagarUseCase {
    constructor(private readonly repository: CuentaPorPagarRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<CuentaPorPagarEntity>> {
        return this.repository.getAll();
    }
}
