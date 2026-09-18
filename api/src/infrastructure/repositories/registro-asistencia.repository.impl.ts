import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateRegistroAsistenciaDto } from "../../domain/dtos/registro-asistencia/create-registro-asistencia.dto";
import { UpdateRegistroAsistenciaDto } from "../../domain/dtos/registro-asistencia/update-registro-asistencia.dto";
import { RegistroAsistenciaDatasource } from "../../domain/datasources/registro-asistencia.datasource";
import { RegistroAsistenciaEntity } from "../../domain/entitites/registro-asistencia.entity";
import { RegistroAsistenciaRepository } from "../../domain/repositories/registro-asistencia.repository";

export class RegistroAsistenciaRepositoryImpl implements RegistroAsistenciaRepository {
    constructor(private readonly datasource: RegistroAsistenciaDatasource) {}

    create(dto: CreateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, empleadoid?: number, fechaInicio?: Date, fechaFin?: Date): Promise<PaginatedResult<RegistroAsistenciaEntity>> {
        return this.datasource.getAll(page, limit, empleadoid, fechaInicio, fechaFin);
    }

    getById(id: number): Promise<RegistroAsistenciaEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<RegistroAsistenciaEntity> {
        return this.datasource.delete(id);
    }
}
