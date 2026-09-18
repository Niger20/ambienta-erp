import {ProductCategoryEntity} from "../../entitites/productCategory.entity";
import { UpdateProductCategoryDto} from "../../dtos";
import {ProductCategoryRepository} from "../../repositories/productCategory.repository";


export interface GetByIdProductCategoryUseCase {
    execute( id : Number ): Promise<ProductCategoryEntity|null>;
}

export class GetByIdProductCategory implements GetByIdProductCategoryUseCase {

    constructor(private readonly productCategoryRepository: ProductCategoryRepository) {}

    execute( id : number): Promise<ProductCategoryEntity|null> {
        return this.productCategoryRepository.getById(id);
    }

}