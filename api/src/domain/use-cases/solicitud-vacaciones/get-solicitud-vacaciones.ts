import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { SolicitudVacacionesEntity } from "../../entitites/solicitud-vacaciones.entity";
import { SolicitudVacacionesRepository } from "../../repositories/solicitud-vacaciones.repository";

export interface GetSolicitudVacacionesUseCase {
    execute(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<SolicitudVacacionesEntity>>;
}

export class GetSolicitudVacaciones implements GetSolicitudVacacionesUseCase {
    constructor(private readonly repository: SolicitudVacacionesRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<SolicitudVacacionesEntity>> {
        return this.repository.getAll(page, limit, empleadoid, estado);
    }
}
