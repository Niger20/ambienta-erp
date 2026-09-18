import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { MovimientoCompraEntity } from "../../entitites/movimientoCompra.entity";
import { MovimientoCompraRepository } from "../../repositories/movimientoCompra.repository";

export interface GetMovimientoCompraUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<MovimientoCompraEntity>>;
}

export class GetMovimientoCompra implements GetMovimientoCompraUseCase {
    constructor(private readonly repository: MovimientoCompraRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<MovimientoCompraEntity>> {
        return this.repository.getAll();
    }
}
