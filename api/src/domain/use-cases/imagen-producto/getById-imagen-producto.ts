import { ImagenProductoEntity } from "../../entitites/imagen-producto.entity";
import { ImagenProductoRepository } from "../../repositories/imagen-producto.repository";

export interface GetByIdImagenProductoUseCase {
    execute(id: number): Promise<ImagenProductoEntity | null>;
}

export class GetByIdImagenProducto implements GetByIdImagenProductoUseCase {
    constructor(private readonly repository: ImagenProductoRepository) {}

    execute(id: number): Promise<ImagenProductoEntity | null> {
        return this.repository.getById(id);
    }
}
