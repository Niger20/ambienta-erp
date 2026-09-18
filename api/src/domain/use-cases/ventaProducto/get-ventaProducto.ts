import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { VentaProductoEntity } from "../../entitites/ventaProducto.entity";
import { VentaProductoRepository } from "../../repositories/ventaProducto.repository";


export interface GetVentaProductoUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<VentaProductoEntity>>;
}

export class GetVentaProducto implements GetVentaProductoUseCase {

    constructor(private readonly repository: VentaProductoRepository) { }

    execute(page?: number, limit?: number): Promise<PaginatedResult<VentaProductoEntity>> {
        return this.repository.getAll();
    }

}
