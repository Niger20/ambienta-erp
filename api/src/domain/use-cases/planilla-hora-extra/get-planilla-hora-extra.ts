import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { PlanillaHoraExtraEntity } from "../../entitites/planilla-hora-extra.entity";
import { PlanillaHoraExtraRepository } from "../../repositories/planilla-hora-extra.repository";

export interface GetPlanillaHoraExtraUseCase {
    execute(page?: number, limit?: number, detalleid?: number): Promise<PaginatedResult<PlanillaHoraExtraEntity>>;
}

export class GetPlanillaHoraExtra implements GetPlanillaHoraExtraUseCase {
    constructor(private readonly repository: PlanillaHoraExtraRepository) {}

    execute(page?: number, limit?: number, detalleid?: number): Promise<PaginatedResult<PlanillaHoraExtraEntity>> {
        return this.repository.getAll(page, limit, detalleid);
    }
}
