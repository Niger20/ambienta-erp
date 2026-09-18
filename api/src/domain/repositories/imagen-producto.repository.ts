import { CreateImagenProductoDto } from "../dtos/imagen-producto/create-imagen-producto.dto";
import { UpdateImagenProductoDto } from "../dtos/imagen-producto/update-imagen-producto.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { ImagenProductoEntity } from "../entitites/imagen-producto.entity";

export abstract class ImagenProductoRepository {
    abstract create(dto: CreateImagenProductoDto): Promise<ImagenProductoEntity>;
    abstract getAll(page?: number, limit?: number, productoid?: number): Promise<PaginatedResult<ImagenProductoEntity>>;
    abstract getById(id: number): Promise<ImagenProductoEntity | null>;
    abstract update(dto: UpdateImagenProductoDto): Promise<ImagenProductoEntity | null>;
    abstract delete(id: number): Promise<ImagenProductoEntity>;
}
