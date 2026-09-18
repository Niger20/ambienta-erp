import { FeriadoNacionalEntity } from "../../entitites/feriado-nacional.entity";
import { FeriadoNacionalRepository } from "../../repositories/feriado-nacional.repository";

export interface DeleteFeriadoNacionalUseCase {
    execute(id: number): Promise<FeriadoNacionalEntity>;
}

export class DeleteFeriadoNacional implements DeleteFeriadoNacionalUseCase {
    constructor(private readonly repository: FeriadoNacionalRepository) {}

    execute(id: number): Promise<FeriadoNacionalEntity> {
        return this.repository.delete(id);
    }
}
