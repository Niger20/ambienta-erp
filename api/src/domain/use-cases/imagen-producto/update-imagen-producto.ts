import { UpdateImagenProductoDto } from "../../dtos/imagen-producto/update-imagen-producto.dto";
import { ImagenProductoEntity } from "../../entitites/imagen-producto.entity";
import { ImagenProductoRepository } from "../../repositories/imagen-producto.repository";

export interface UpdateImagenProductoUseCase {
    execute(dto: UpdateImagenProductoDto): Promise<ImagenProductoEntity | null>;
}

export class UpdateImagenProducto implements UpdateImagenProductoUseCase {
    constructor(private readonly repository: ImagenProductoRepository) {}

    execute(dto: UpdateImagenProductoDto): Promise<ImagenProductoEntity | null> {
        return this.repository.update(dto);
    }
}
