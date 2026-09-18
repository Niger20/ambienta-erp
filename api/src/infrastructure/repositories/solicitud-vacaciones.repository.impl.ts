import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateSolicitudVacacionesDto } from "../../domain/dtos/solicitud-vacaciones/create-solicitud-vacaciones.dto";
import { UpdateSolicitudVacacionesDto } from "../../domain/dtos/solicitud-vacaciones/update-solicitud-vacaciones.dto";
import { SolicitudVacacionesDatasource } from "../../domain/datasources/solicitud-vacaciones.datasource";
import { SolicitudVacacionesEntity } from "../../domain/entitites/solicitud-vacaciones.entity";
import { SolicitudVacacionesRepository } from "../../domain/repositories/solicitud-vacaciones.repository";

export class SolicitudVacacionesRepositoryImpl implements SolicitudVacacionesRepository {
    constructor(private readonly datasource: SolicitudVacacionesDatasource) {}

    create(dto: CreateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<SolicitudVacacionesEntity>> {
        return this.datasource.getAll(page, limit, empleadoid, estado);
    }

    getById(id: number): Promise<SolicitudVacacionesEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<SolicitudVacacionesEntity> {
        return this.datasource.delete(id);
    }
}
