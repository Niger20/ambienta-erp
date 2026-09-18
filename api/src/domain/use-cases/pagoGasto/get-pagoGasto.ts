import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { PagoGastoEntity } from "../../entitites/pagoGasto.entity";
import { PagoGastoRepository } from "../../repositories/pagoGasto.repository";

export interface GetPagoGastoUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<PagoGastoEntity>>;
}

export class GetPagoGasto implements GetPagoGastoUseCase {
    constructor(private readonly repository: PagoGastoRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<PagoGastoEntity>> {
        return this.repository.getAll();
    }
}
