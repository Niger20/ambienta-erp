import { ImagenProductoEntity } from "../../entitites/imagen-producto.entity";
import { ImagenProductoRepository } from "../../repositories/imagen-producto.repository";

export interface DeleteImagenProductoUseCase {
    execute(id: number): Promise<ImagenProductoEntity>;
}

export class DeleteImagenProducto implements DeleteImagenProductoUseCase {
    constructor(private readonly repository: ImagenProductoRepository) {}

    execute(id: number): Promise<ImagenProductoEntity> {
        return this.repository.delete(id);
    }
}
