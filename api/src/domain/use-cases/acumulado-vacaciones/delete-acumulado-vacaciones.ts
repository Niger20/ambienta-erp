import { AcumuladoVacacionesEntity } from "../../entitites/acumulado-vacaciones.entity";
import { AcumuladoVacacionesRepository } from "../../repositories/acumulado-vacaciones.repository";

export interface DeleteAcumuladoVacacionesUseCase {
    execute(id: number): Promise<AcumuladoVacacionesEntity>;
}

export class DeleteAcumuladoVacaciones implements DeleteAcumuladoVacacionesUseCase {
    constructor(private readonly repository: AcumuladoVacacionesRepository) {}

    execute(id: number): Promise<AcumuladoVacacionesEntity> {
        return this.repository.delete(id);
    }
}
