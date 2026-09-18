import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { DevolucionEntity } from "../../entitites/devolucion.entity";
import { DevolucionRepository } from "../../repositories/devolucion.repository";

export interface GetDevolucionUseCase {
    execute(page?: number, limit?: number, ventaid?: number, productoid?: number): Promise<PaginatedResult<DevolucionEntity>>;
}

export class GetDevolucion implements GetDevolucionUseCase {
    constructor(private readonly repository: DevolucionRepository) {}

    execute(page?: number, limit?: number, ventaid?: number, productoid?: number): Promise<PaginatedResult<DevolucionEntity>> {
        return this.repository.getAll(page, limit, ventaid, productoid);
    }
}
