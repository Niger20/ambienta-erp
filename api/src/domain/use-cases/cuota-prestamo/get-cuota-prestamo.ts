import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { CuotaPrestamoEntity } from "../../entitites/cuota-prestamo.entity";
import { CuotaPrestamoRepository } from "../../repositories/cuota-prestamo.repository";

export interface GetCuotaPrestamoUseCase {
    execute(page?: number, limit?: number, prestamoid?: number, estado?: string): Promise<PaginatedResult<CuotaPrestamoEntity>>;
}

export class GetCuotaPrestamo implements GetCuotaPrestamoUseCase {
    constructor(private readonly repository: CuotaPrestamoRepository) {}

    execute(page?: number, limit?: number, prestamoid?: number, estado?: string): Promise<PaginatedResult<CuotaPrestamoEntity>> {
        return this.repository.getAll(page, limit, prestamoid, estado);
    }
}
