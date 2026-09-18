import { UpdateFeriadoNacionalDto } from "../../dtos/feriado-nacional/update-feriado-nacional.dto";
import { FeriadoNacionalEntity } from "../../entitites/feriado-nacional.entity";
import { FeriadoNacionalRepository } from "../../repositories/feriado-nacional.repository";

export interface UpdateFeriadoNacionalUseCase {
    execute(dto: UpdateFeriadoNacionalDto): Promise<FeriadoNacionalEntity | null>;
}

export class UpdateFeriadoNacional implements UpdateFeriadoNacionalUseCase {
    constructor(private readonly repository: FeriadoNacionalRepository) {}

    execute(dto: UpdateFeriadoNacionalDto): Promise<FeriadoNacionalEntity | null> {
        return this.repository.update(dto);
    }
}
