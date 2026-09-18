import { CreateRegistroAsistenciaDto } from "../dtos/registro-asistencia/create-registro-asistencia.dto";
import { UpdateRegistroAsistenciaDto } from "../dtos/registro-asistencia/update-registro-asistencia.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { RegistroAsistenciaEntity } from "../entitites/registro-asistencia.entity";

export abstract class RegistroAsistenciaRepository {
    abstract create(dto: CreateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number, fechaInicio?: Date, fechaFin?: Date): Promise<PaginatedResult<RegistroAsistenciaEntity>>;
    abstract getById(id: number): Promise<RegistroAsistenciaEntity | null>;
    abstract update(dto: UpdateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity | null>;
    abstract delete(id: number): Promise<RegistroAsistenciaEntity>;
}
