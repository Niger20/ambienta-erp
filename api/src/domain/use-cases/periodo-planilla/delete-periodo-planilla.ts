import { PeriodoPlanillaEntity } from "../../entitites/periodo-planilla.entity";
import { PeriodoPlanillaRepository } from "../../repositories/periodo-planilla.repository";

export interface DeletePeriodoPlanillaUseCase {
    execute(id: number): Promise<PeriodoPlanillaEntity>;
}

export class DeletePeriodoPlanilla implements DeletePeriodoPlanillaUseCase {
    constructor(private readonly repository: PeriodoPlanillaRepository) {}

    execute(id: number): Promise<PeriodoPlanillaEntity> {
        return this.repository.delete(id);
    }
}
