import { AcumuladoVacacionesEntity } from "../../entitites/acumulado-vacaciones.entity";
import { AcumuladoVacacionesRepository } from "../../repositories/acumulado-vacaciones.repository";

export interface GetByIdAcumuladoVacacionesUseCase {
    execute(id: number): Promise<AcumuladoVacacionesEntity | null>;
}

export class GetByIdAcumuladoVacaciones implements GetByIdAcumuladoVacacionesUseCase {
    constructor(private readonly repository: AcumuladoVacacionesRepository) {}

    execute(id: number): Promise<AcumuladoVacacionesEntity | null> {
        return this.repository.getById(id);
    }
}
