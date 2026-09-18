import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { AcumuladoVacacionesEntity } from "../../entitites/acumulado-vacaciones.entity";
import { AcumuladoVacacionesRepository } from "../../repositories/acumulado-vacaciones.repository";

export interface GetAcumuladoVacacionesUseCase {
    execute(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoVacacionesEntity>>;
}

export class GetAcumuladoVacaciones implements GetAcumuladoVacacionesUseCase {
    constructor(private readonly repository: AcumuladoVacacionesRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoVacacionesEntity>> {
        return this.repository.getAll(page, limit, empleadoid, periodoid);
    }
}
