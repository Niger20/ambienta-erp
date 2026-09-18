import { CreateAcumuladoVacacionesDto } from "../../dtos/acumulado-vacaciones/create-acumulado-vacaciones.dto";
import { AcumuladoVacacionesEntity } from "../../entitites/acumulado-vacaciones.entity";
import { AcumuladoVacacionesRepository } from "../../repositories/acumulado-vacaciones.repository";

export interface CreateAcumuladoVacacionesUseCase {
    execute(dto: CreateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity>;
}

export class CreateAcumuladoVacaciones implements CreateAcumuladoVacacionesUseCase {
    constructor(private readonly repository: AcumuladoVacacionesRepository) {}

    execute(dto: CreateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity> {
        return this.repository.create(dto);
    }
}
