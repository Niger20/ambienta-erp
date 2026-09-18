import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { CuentaPorCobrarEntity } from "../../entitites/cuentaPorCobrar.entity";
import { CuentaPorCobrarRepository } from "../../repositories/cuentaPorCobrar.repository";

export interface GetCuentaPorCobrarUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<CuentaPorCobrarEntity>>;
}

export class GetCuentaPorCobrar implements GetCuentaPorCobrarUseCase {
    constructor(private readonly repository: CuentaPorCobrarRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<CuentaPorCobrarEntity>> {
        return this.repository.getAll();
    }
}
