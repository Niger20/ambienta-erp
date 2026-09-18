import { PeriodoPlanillaEntity } from "../../entitites/periodo-planilla.entity";
import { PeriodoPlanillaRepository } from "../../repositories/periodo-planilla.repository";

export interface GetByIdPeriodoPlanillaUseCase {
    execute(id: number): Promise<PeriodoPlanillaEntity | null>;
}

export class GetByIdPeriodoPlanilla implements GetByIdPeriodoPlanillaUseCase {
    constructor(private readonly repository: PeriodoPlanillaRepository) {}

    execute(id: number): Promise<PeriodoPlanillaEntity | null> {
        return this.repository.getById(id);
    }
}
