import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { RegistroAsistenciaEntity } from "../../entitites/registro-asistencia.entity";
import { RegistroAsistenciaRepository } from "../../repositories/registro-asistencia.repository";

export interface GetRegistroAsistenciaUseCase {
    execute(page?: number, limit?: number, empleadoid?: number, fechaInicio?: Date, fechaFin?: Date): Promise<PaginatedResult<RegistroAsistenciaEntity>>;
}

export class GetRegistroAsistencia implements GetRegistroAsistenciaUseCase {
    constructor(private readonly repository: RegistroAsistenciaRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number, fechaInicio?: Date, fechaFin?: Date): Promise<PaginatedResult<RegistroAsistenciaEntity>> {
        return this.repository.getAll(page, limit, empleadoid, fechaInicio, fechaFin);
    }
}
