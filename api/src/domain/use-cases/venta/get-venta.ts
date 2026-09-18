import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { VentaEntity } from "../../entitites/venta.entity";
import { VentaRepository } from "../../repositories/venta.repository";


export interface GetVentaUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<VentaEntity>>;
}

export class GetVenta implements GetVentaUseCase {

    constructor(private readonly ventaRepository: VentaRepository) { }

    execute(page?: number, limit?: number): Promise<PaginatedResult<VentaEntity>> {
        return this.ventaRepository.getAll(page, limit);
    }

}
