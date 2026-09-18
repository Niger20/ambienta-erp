import { UpdatePeriodoPlanillaDto } from "../../dtos/periodo-planilla/update-periodo-planilla.dto";
import { PeriodoPlanillaEntity } from "../../entitites/periodo-planilla.entity";
import { PeriodoPlanillaRepository } from "../../repositories/periodo-planilla.repository";

export interface UpdatePeriodoPlanillaUseCase {
    execute(dto: UpdatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity | null>;
}

export class UpdatePeriodoPlanilla implements UpdatePeriodoPlanillaUseCase {
    constructor(private readonly repository: PeriodoPlanillaRepository) {}

    execute(dto: UpdatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity | null> {
        return this.repository.update(dto);
    }
}
