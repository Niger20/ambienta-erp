import { UpdateAcumuladoVacacionesDto } from "../../dtos/acumulado-vacaciones/update-acumulado-vacaciones.dto";
import { AcumuladoVacacionesEntity } from "../../entitites/acumulado-vacaciones.entity";
import { AcumuladoVacacionesRepository } from "../../repositories/acumulado-vacaciones.repository";

export interface UpdateAcumuladoVacacionesUseCase {
    execute(dto: UpdateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity | null>;
}

export class UpdateAcumuladoVacaciones implements UpdateAcumuladoVacacionesUseCase {
    constructor(private readonly repository: AcumuladoVacacionesRepository) {}

    execute(dto: UpdateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity | null> {
        return this.repository.update(dto);
    }
}
