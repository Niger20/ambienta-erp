import { PlanillaHoraExtraEntity } from "../../entitites/planilla-hora-extra.entity";
import { PlanillaHoraExtraRepository } from "../../repositories/planilla-hora-extra.repository";

export interface DeletePlanillaHoraExtraUseCase {
    execute(id: number): Promise<PlanillaHoraExtraEntity>;
}

export class DeletePlanillaHoraExtra implements DeletePlanillaHoraExtraUseCase {
    constructor(private readonly repository: PlanillaHoraExtraRepository) {}

    execute(id: number): Promise<PlanillaHoraExtraEntity> {
        return this.repository.delete(id);
    }
}
