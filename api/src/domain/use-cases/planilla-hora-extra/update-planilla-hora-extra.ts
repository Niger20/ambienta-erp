import { UpdatePlanillaHoraExtraDto } from "../../dtos/planilla-hora-extra/update-planilla-hora-extra.dto";
import { PlanillaHoraExtraEntity } from "../../entitites/planilla-hora-extra.entity";
import { PlanillaHoraExtraRepository } from "../../repositories/planilla-hora-extra.repository";

export interface UpdatePlanillaHoraExtraUseCase {
    execute(dto: UpdatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity | null>;
}

export class UpdatePlanillaHoraExtra implements UpdatePlanillaHoraExtraUseCase {
    constructor(private readonly repository: PlanillaHoraExtraRepository) {}

    execute(dto: UpdatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity | null> {
        return this.repository.update(dto);
    }
}
