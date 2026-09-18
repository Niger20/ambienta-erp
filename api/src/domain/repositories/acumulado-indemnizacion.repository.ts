import { CreateAcumuladoIndemnizacionDto } from "../dtos/acumulado-indemnizacion/create-acumulado-indemnizacion.dto";
import { UpdateAcumuladoIndemnizacionDto } from "../dtos/acumulado-indemnizacion/update-acumulado-indemnizacion.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { AcumuladoIndemnizacionEntity } from "../entitites/acumulado-indemnizacion.entity";

export abstract class AcumuladoIndemnizacionRepository {
    abstract create(dto: CreateAcumuladoIndemnizacionDto): Promise<AcumuladoIndemnizacionEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoIndemnizacionEntity>>;
    abstract getById(id: number): Promise<AcumuladoIndemnizacionEntity | null>;
    abstract update(dto: UpdateAcumuladoIndemnizacionDto): Promise<AcumuladoIndemnizacionEntity | null>;
    abstract delete(id: number): Promise<AcumuladoIndemnizacionEntity>;
}
