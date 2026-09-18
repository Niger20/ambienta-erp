import { PaginatedResult } from "../dtos/shared/pagination.dto";
import {ProductCategoryEntity} from "../entitites/productCategory.entity";
import {CreateProductCategoryDto, UpdateProductCategoryDto} from "../dtos";


export abstract class ProductCategoryRepository {

    abstract create( createProductCategoryDto : CreateProductCategoryDto): Promise<ProductCategoryEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<ProductCategoryEntity>>;
    abstract getById(id: number): Promise<ProductCategoryEntity|null>;
    abstract update( updateProductCategoryDto : UpdateProductCategoryDto): Promise<ProductCategoryEntity|null>;
    abstract delete(id: number): Promise<ProductCategoryEntity>;


}