import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateAcumuladoVacacionesDto } from "../../domain/dtos/acumulado-vacaciones/create-acumulado-vacaciones.dto";
import { UpdateAcumuladoVacacionesDto } from "../../domain/dtos/acumulado-vacaciones/update-acumulado-vacaciones.dto";
import { AcumuladoVacacionesDatasource } from "../../domain/datasources/acumulado-vacaciones.datasource";
import { AcumuladoVacacionesEntity } from "../../domain/entitites/acumulado-vacaciones.entity";
import { AcumuladoVacacionesRepository } from "../../domain/repositories/acumulado-vacaciones.repository";

export class AcumuladoVacacionesRepositoryImpl implements AcumuladoVacacionesRepository {
    constructor(private readonly datasource: AcumuladoVacacionesDatasource) {}

    create(dto: CreateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoVacacionesEntity>> {
        return this.datasource.getAll(page, limit, empleadoid, periodoid);
    }

    getById(id: number): Promise<AcumuladoVacacionesEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<AcumuladoVacacionesEntity> {
        return this.datasource.delete(id);
    }
}
