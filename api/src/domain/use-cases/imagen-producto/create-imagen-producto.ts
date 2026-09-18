import { CreateImagenProductoDto } from "../../dtos/imagen-producto/create-imagen-producto.dto";
import { ImagenProductoEntity } from "../../entitites/imagen-producto.entity";
import { ImagenProductoRepository } from "../../repositories/imagen-producto.repository";

export interface CreateImagenProductoUseCase {
    execute(dto: CreateImagenProductoDto): Promise<ImagenProductoEntity>;
}

export class CreateImagenProducto implements CreateImagenProductoUseCase {
    constructor(private readonly repository: ImagenProductoRepository) {}

    execute(dto: CreateImagenProductoDto): Promise<ImagenProductoEntity> {
        return this.repository.create(dto);
    }
}
