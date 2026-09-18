import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { ImagenProductoEntity } from "../../entitites/imagen-producto.entity";
import { ImagenProductoRepository } from "../../repositories/imagen-producto.repository";

export interface GetImagenProductoUseCase {
    execute(page?: number, limit?: number, productoid?: number): Promise<PaginatedResult<ImagenProductoEntity>>;
}

export class GetImagenProducto implements GetImagenProductoUseCase {
    constructor(private readonly repository: ImagenProductoRepository) {}

    execute(page?: number, limit?: number, productoid?: number): Promise<PaginatedResult<ImagenProductoEntity>> {
        return this.repository.getAll(page, limit, productoid);
    }
}
