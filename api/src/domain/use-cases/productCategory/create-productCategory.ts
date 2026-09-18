import {ProductCategoryEntity} from "../../entitites/productCategory.entity";
import {CreateProductCategoryDto} from "../../dtos";
import {ProductCategoryRepository} from "../../repositories/productCategory.repository";


export interface CreateProductCategoryUseCase {
    execute( dto: CreateProductCategoryDto ): Promise<ProductCategoryEntity>;
}

export class CreateProductCategory implements CreateProductCategoryUseCase {

    constructor(private readonly productCategoryRepository: ProductCategoryRepository) {}

    execute(dto: CreateProductCategoryDto): Promise<ProductCategoryEntity> {
        return this.productCategoryRepository.create(dto);
    }

}