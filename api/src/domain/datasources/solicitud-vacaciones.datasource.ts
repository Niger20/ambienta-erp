import { CreateSolicitudVacacionesDto } from "../dtos/solicitud-vacaciones/create-solicitud-vacaciones.dto";
import { UpdateSolicitudVacacionesDto } from "../dtos/solicitud-vacaciones/update-solicitud-vacaciones.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { SolicitudVacacionesEntity } from "../entitites/solicitud-vacaciones.entity";

export abstract class SolicitudVacacionesDatasource {
    abstract create(dto: CreateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<SolicitudVacacionesEntity>>;
    abstract getById(id: number): Promise<SolicitudVacacionesEntity | null>;
    abstract update(dto: UpdateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity | null>;
    abstract delete(id: number): Promise<SolicitudVacacionesEntity>;
}
