import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import {ProductoEntity} from "../../entitites/producto.entity";
import {ProductoRepository} from "../../repositories/producto.repository";


export interface GetProductoUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<ProductoEntity>>;
}

export class GetProducto implements GetProductoUseCase {

    constructor(private readonly productoRepository: ProductoRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<ProductoEntity>> {
        return this.productoRepository.getAll(page, limit);
    }

}