import { CreatePeriodoPlanillaDto } from "../../dtos/periodo-planilla/create-periodo-planilla.dto";
import { PeriodoPlanillaEntity } from "../../entitites/periodo-planilla.entity";
import { PeriodoPlanillaRepository } from "../../repositories/periodo-planilla.repository";

export interface CreatePeriodoPlanillaUseCase {
    execute(dto: CreatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity>;
}

export class CreatePeriodoPlanilla implements CreatePeriodoPlanillaUseCase {
    constructor(private readonly repository: PeriodoPlanillaRepository) {}

    execute(dto: CreatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity> {
        return this.repository.create(dto);
    }
}
