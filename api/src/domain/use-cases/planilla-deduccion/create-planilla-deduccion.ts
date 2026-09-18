import { CreatePlanillaDeduccionDto } from "../../dtos/planilla-deduccion/create-planilla-deduccion.dto";
import { PlanillaDeduccionEntity } from "../../entitites/planilla-deduccion.entity";
import { PlanillaDeduccionRepository } from "../../repositories/planilla-deduccion.repository";

export interface CreatePlanillaDeduccionUseCase {
    execute(dto: CreatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity>;
}

export class CreatePlanillaDeduccion implements CreatePlanillaDeduccionUseCase {
    constructor(private readonly repository: PlanillaDeduccionRepository) {}

    execute(dto: CreatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity> {
        return this.repository.create(dto);
    }
}
