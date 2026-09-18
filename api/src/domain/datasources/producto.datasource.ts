import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { ProductoEntity } from "../entitites/producto.entity";
import { CreateProductoDto, UpdateProductoDto } from "../dtos";


export abstract class ProductoDatasource {

    abstract create(create: CreateProductoDto): Promise<ProductoEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<ProductoEntity>>;
    abstract getDeactivated(): Promise<ProductoEntity[]>;
    abstract getById(id: number): Promise<ProductoEntity | null>;
    abstract getByBarcode(codigobarra: string): Promise<ProductoEntity | null>;
    abstract update(UpdateProductoDto: UpdateProductoDto): Promise<ProductoEntity | null>;
    abstract delete(id: number): Promise<ProductoEntity>;
    abstract searchByName(query: string): Promise<ProductoEntity[]>;
    abstract recalculateStockMinimo(): Promise<void>;

}