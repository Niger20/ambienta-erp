import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { PlanillaDeduccionEntity } from "../../entitites/planilla-deduccion.entity";
import { PlanillaDeduccionRepository } from "../../repositories/planilla-deduccion.repository";

export interface GetPlanillaDeduccionUseCase {
    execute(page?: number, limit?: number, detalleid?: number): Promise<PaginatedResult<PlanillaDeduccionEntity>>;
}

export class GetPlanillaDeduccion implements GetPlanillaDeduccionUseCase {
    constructor(private readonly repository: PlanillaDeduccionRepository) {}

    execute(page?: number, limit?: number, detalleid?: number): Promise<PaginatedResult<PlanillaDeduccionEntity>> {
        return this.repository.getAll(page, limit, detalleid);
    }
}
