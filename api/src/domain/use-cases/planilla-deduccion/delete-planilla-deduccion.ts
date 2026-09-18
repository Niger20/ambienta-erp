import { PlanillaDeduccionEntity } from "../../entitites/planilla-deduccion.entity";
import { PlanillaDeduccionRepository } from "../../repositories/planilla-deduccion.repository";

export interface DeletePlanillaDeduccionUseCase {
    execute(id: number): Promise<PlanillaDeduccionEntity>;
}

export class DeletePlanillaDeduccion implements DeletePlanillaDeduccionUseCase {
    constructor(private readonly repository: PlanillaDeduccionRepository) {}

    execute(id: number): Promise<PlanillaDeduccionEntity> {
        return this.repository.delete(id);
    }
}
