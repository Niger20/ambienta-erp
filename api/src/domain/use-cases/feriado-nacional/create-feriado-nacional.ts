import { CreateFeriadoNacionalDto } from "../../dtos/feriado-nacional/create-feriado-nacional.dto";
import { FeriadoNacionalEntity } from "../../entitites/feriado-nacional.entity";
import { FeriadoNacionalRepository } from "../../repositories/feriado-nacional.repository";

export interface CreateFeriadoNacionalUseCase {
    execute(dto: CreateFeriadoNacionalDto): Promise<FeriadoNacionalEntity>;
}

export class CreateFeriadoNacional implements CreateFeriadoNacionalUseCase {
    constructor(private readonly repository: FeriadoNacionalRepository) {}

    execute(dto: CreateFeriadoNacionalDto): Promise<FeriadoNacionalEntity> {
        return this.repository.create(dto);
    }
}
