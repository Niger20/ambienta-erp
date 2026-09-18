import {ProductCategoryEntity} from "../../entitites/productCategory.entity";
import { UpdateProductCategoryDto} from "../../dtos";
import {ProductCategoryRepository} from "../../repositories/productCategory.repository";


export interface UpdateProductCategoryUseCase {
    execute( dto: UpdateProductCategoryDto ): Promise<ProductCategoryEntity|null>;
}

export class UpdateProductCategory implements UpdateProductCategoryUseCase {

    constructor(private readonly productCategoryRepository: ProductCategoryRepository) {}

    execute(dto: UpdateProductCategoryDto): Promise<ProductCategoryEntity|null> {
        return this.productCategoryRepository.update(dto);
    }

}