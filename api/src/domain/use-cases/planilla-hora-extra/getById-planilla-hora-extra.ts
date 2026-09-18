import { PlanillaHoraExtraEntity } from "../../entitites/planilla-hora-extra.entity";
import { PlanillaHoraExtraRepository } from "../../repositories/planilla-hora-extra.repository";

export interface GetByIdPlanillaHoraExtraUseCase {
    execute(id: number): Promise<PlanillaHoraExtraEntity | null>;
}

export class GetByIdPlanillaHoraExtra implements GetByIdPlanillaHoraExtraUseCase {
    constructor(private readonly repository: PlanillaHoraExtraRepository) {}

    execute(id: number): Promise<PlanillaHoraExtraEntity | null> {
        return this.repository.getById(id);
    }
}
