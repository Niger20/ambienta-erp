import { CreateDevolucionDto } from "../dtos/devolucion/create-devolucion.dto";
import { UpdateDevolucionDto } from "../dtos/devolucion/update-devolucion.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { DevolucionEntity } from "../entitites/devolucion.entity";

export abstract class DevolucionRepository {
    abstract create(dto: CreateDevolucionDto): Promise<DevolucionEntity>;
    abstract getAll(page?: number, limit?: number, ventaid?: number, productoid?: number): Promise<PaginatedResult<DevolucionEntity>>;
    abstract getById(id: number): Promise<DevolucionEntity | null>;
    abstract update(dto: UpdateDevolucionDto): Promise<DevolucionEntity | null>;
    abstract delete(id: number): Promise<DevolucionEntity>;
}
