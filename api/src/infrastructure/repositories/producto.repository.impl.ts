import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateProductoDto,
    ProductoDatasource, ProductoEntity,
    ProductoRepository,
    UpdateProductoDto
} from "../../domain";


export class ProductoRepositoryImpl implements ProductoRepository {

    constructor(private readonly datasource: ProductoDatasource) { }

    create(createProductoDto: CreateProductoDto): Promise<ProductoEntity> {
        return this.datasource.create(createProductoDto);
    }

    delete(id: number): Promise<ProductoEntity> {
        return this.datasource.delete(id)
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<ProductoEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getDeactivated(): Promise<ProductoEntity[]> {
        return this.datasource.getDeactivated();
    }

    getById(id: number): Promise<ProductoEntity | null> {
        return this.datasource.getById(id);
    }

    getByBarcode(codigobarra: string): Promise<ProductoEntity | null> {
        return this.datasource.getByBarcode(codigobarra);
    }

    update(updateProductoDto: UpdateProductoDto): Promise<ProductoEntity | null> {
        return this.datasource.update(updateProductoDto);
    }

    searchByName(query: string): Promise<ProductoEntity[]> {
        return this.datasource.searchByName(query);
    }

    recalculateStockMinimo(): Promise<void> {
        return this.datasource.recalculateStockMinimo();
    }

}