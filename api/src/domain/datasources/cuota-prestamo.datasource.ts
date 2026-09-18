import { CreateCuotaPrestamoDto } from "../dtos/cuota-prestamo/create-cuota-prestamo.dto";
import { UpdateCuotaPrestamoDto } from "../dtos/cuota-prestamo/update-cuota-prestamo.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { CuotaPrestamoEntity } from "../entitites/cuota-prestamo.entity";

export abstract class CuotaPrestamoDatasource {
    abstract create(dto: CreateCuotaPrestamoDto): Promise<CuotaPrestamoEntity>;
    abstract getAll(page?: number, limit?: number, prestamoid?: number, estado?: string): Promise<PaginatedResult<CuotaPrestamoEntity>>;
    abstract getById(id: number): Promise<CuotaPrestamoEntity | null>;
    abstract update(dto: UpdateCuotaPrestamoDto): Promise<CuotaPrestamoEntity | null>;
    abstract delete(id: number): Promise<CuotaPrestamoEntity>;
}
