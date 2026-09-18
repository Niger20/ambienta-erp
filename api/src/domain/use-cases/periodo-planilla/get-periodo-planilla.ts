import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { PeriodoPlanillaEntity } from "../../entitites/periodo-planilla.entity";
import { PeriodoPlanillaRepository } from "../../repositories/periodo-planilla.repository";

export interface GetPeriodoPlanillaUseCase {
    execute(page?: number, limit?: number, estado?: string): Promise<PaginatedResult<PeriodoPlanillaEntity>>;
}

export class GetPeriodoPlanilla implements GetPeriodoPlanillaUseCase {
    constructor(private readonly repository: PeriodoPlanillaRepository) {}

    execute(page?: number, limit?: number, estado?: string): Promise<PaginatedResult<PeriodoPlanillaEntity>> {
        return this.repository.getAll(page, limit, estado);
    }
}
