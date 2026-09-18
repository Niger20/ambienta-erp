import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import {ProductCategoryEntity} from "../../entitites/productCategory.entity";
import {ProductCategoryRepository} from "../../repositories/productCategory.repository";


export interface GetProductCategoryUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<ProductCategoryEntity>>;
}

export class GetProductCategory implements GetProductCategoryUseCase {

    constructor(private readonly productCategoryRepository: ProductCategoryRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<ProductCategoryEntity>> {
        return this.productCategoryRepository.getAll(page, limit);
    }

}