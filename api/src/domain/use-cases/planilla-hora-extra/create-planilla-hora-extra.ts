import { CreatePlanillaHoraExtraDto } from "../../dtos/planilla-hora-extra/create-planilla-hora-extra.dto";
import { PlanillaHoraExtraEntity } from "../../entitites/planilla-hora-extra.entity";
import { PlanillaHoraExtraRepository } from "../../repositories/planilla-hora-extra.repository";

export interface CreatePlanillaHoraExtraUseCase {
    execute(dto: CreatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity>;
}

export class CreatePlanillaHoraExtra implements CreatePlanillaHoraExtraUseCase {
    constructor(private readonly repository: PlanillaHoraExtraRepository) {}

    execute(dto: CreatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity> {
        return this.repository.create(dto);
    }
}
