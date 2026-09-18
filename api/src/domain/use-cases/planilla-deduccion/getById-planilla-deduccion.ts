import { PlanillaDeduccionEntity } from "../../entitites/planilla-deduccion.entity";
import { PlanillaDeduccionRepository } from "../../repositories/planilla-deduccion.repository";

export interface GetByIdPlanillaDeduccionUseCase {
    execute(id: number): Promise<PlanillaDeduccionEntity | null>;
}

export class GetByIdPlanillaDeduccion implements GetByIdPlanillaDeduccionUseCase {
    constructor(private readonly repository: PlanillaDeduccionRepository) {}

    execute(id: number): Promise<PlanillaDeduccionEntity | null> {
        return this.repository.getById(id);
    }
}
