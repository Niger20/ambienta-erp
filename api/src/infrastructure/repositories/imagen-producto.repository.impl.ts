import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateImagenProductoDto } from "../../domain/dtos/imagen-producto/create-imagen-producto.dto";
import { UpdateImagenProductoDto } from "../../domain/dtos/imagen-producto/update-imagen-producto.dto";
import { ImagenProductoDatasource } from "../../domain/datasources/imagen-producto.datasource";
import { ImagenProductoEntity } from "../../domain/entitites/imagen-producto.entity";
import { ImagenProductoRepository } from "../../domain/repositories/imagen-producto.repository";

export class ImagenProductoRepositoryImpl implements ImagenProductoRepository {
    constructor(private readonly datasource: ImagenProductoDatasource) {}

    create(dto: CreateImagenProductoDto): Promise<ImagenProductoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, productoid?: number): Promise<PaginatedResult<ImagenProductoEntity>> {
        return this.datasource.getAll(page, limit, productoid);
    }

    getById(id: number): Promise<ImagenProductoEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateImagenProductoDto): Promise<ImagenProductoEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<ImagenProductoEntity> {
        return this.datasource.delete(id);
    }
}
