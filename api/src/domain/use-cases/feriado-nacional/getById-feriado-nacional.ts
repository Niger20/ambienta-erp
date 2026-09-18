import { FeriadoNacionalEntity } from "../../entitites/feriado-nacional.entity";
import { FeriadoNacionalRepository } from "../../repositories/feriado-nacional.repository";

export interface GetByIdFeriadoNacionalUseCase {
    execute(id: number): Promise<FeriadoNacionalEntity | null>;
}

export class GetByIdFeriadoNacional implements GetByIdFeriadoNacionalUseCase {
    constructor(private readonly repository: FeriadoNacionalRepository) {}

    execute(id: number): Promise<FeriadoNacionalEntity | null> {
        return this.repository.getById(id);
    }
}
