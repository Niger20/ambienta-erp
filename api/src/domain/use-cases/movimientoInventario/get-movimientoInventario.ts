import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { MovimientoInventarioEntity } from "../../entitites/movimientoInventario.entity";
import { MovimientoInventarioRepository } from "../../repositories/movimientoInventario.repository";

export interface GetMovimientoInventarioUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<MovimientoInventarioEntity>>;
}

export class GetMovimientoInventario implements GetMovimientoInventarioUseCase {
    constructor(private readonly repository: MovimientoInventarioRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<MovimientoInventarioEntity>> {
        return this.repository.getAll();
    }
}
