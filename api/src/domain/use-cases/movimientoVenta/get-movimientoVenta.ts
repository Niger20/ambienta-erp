import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { MovimientoVentaEntity } from "../../entitites/movimientoVenta.entity";
import { MovimientoVentaRepository } from "../../repositories/movimientoVenta.repository";

export interface GetMovimientoVentaUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<MovimientoVentaEntity>>;
}

export class GetMovimientoVenta implements GetMovimientoVentaUseCase {
    constructor(private readonly repository: MovimientoVentaRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<MovimientoVentaEntity>> {
        return this.repository.getAll();
    }
}
