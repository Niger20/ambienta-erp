import { UpdatePlanillaDeduccionDto } from "../../dtos/planilla-deduccion/update-planilla-deduccion.dto";
import { PlanillaDeduccionEntity } from "../../entitites/planilla-deduccion.entity";
import { PlanillaDeduccionRepository } from "../../repositories/planilla-deduccion.repository";

export interface UpdatePlanillaDeduccionUseCase {
    execute(dto: UpdatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity | null>;
}

export class UpdatePlanillaDeduccion implements UpdatePlanillaDeduccionUseCase {
    constructor(private readonly repository: PlanillaDeduccionRepository) {}

    execute(dto: UpdatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity | null> {
        return this.repository.update(dto);
    }
}
