import {ProductCategoryEntity} from "../../entitites/productCategory.entity";
import {ProductCategoryRepository} from "../../repositories/productCategory.repository";


export interface DeleteProductCategoryUseCase {
    execute( id: number ): Promise<ProductCategoryEntity>;
}

export class DeleteProductCategory implements DeleteProductCategoryUseCase {

    constructor(private readonly productCategoryRepository: ProductCategoryRepository) {}

    execute( id: number): Promise<ProductCategoryEntity> {
        return this.productCategoryRepository.delete(id);
    }

}