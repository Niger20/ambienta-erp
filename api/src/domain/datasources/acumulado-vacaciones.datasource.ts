import { CreateAcumuladoVacacionesDto } from "../dtos/acumulado-vacaciones/create-acumulado-vacaciones.dto";
import { UpdateAcumuladoVacacionesDto } from "../dtos/acumulado-vacaciones/update-acumulado-vacaciones.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { AcumuladoVacacionesEntity } from "../entitites/acumulado-vacaciones.entity";

export abstract class AcumuladoVacacionesDatasource {
    abstract create(dto: CreateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoVacacionesEntity>>;
    abstract getById(id: number): Promise<AcumuladoVacacionesEntity | null>;
    abstract update(dto: UpdateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity | null>;
    abstract delete(id: number): Promise<AcumuladoVacacionesEntity>;
}
