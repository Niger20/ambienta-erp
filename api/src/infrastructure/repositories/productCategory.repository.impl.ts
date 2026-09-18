import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateProductCategoryDto, ProductCategoryDataSource,
    ProductCategoryEntity,
    ProductCategoryRepository,
    UpdateProductCategoryDto
} from "../../domain";
import {PrismaClient} from "@prisma/client/extension";


export class ProductCategoryRepositoryImpl implements ProductCategoryRepository {

    constructor(private readonly datasource: ProductCategoryDataSource) {}

    create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategoryEntity> {
        return this.datasource.create(createProductCategoryDto);
    }

    delete(id: number): Promise<ProductCategoryEntity> {
        return this.datasource.delete(id)
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<ProductCategoryEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<ProductCategoryEntity | null> {
        return this.datasource.getById(id);
    }

    update(updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategoryEntity | null> {
        return this.datasource.update(updateProductCategoryDto);
    }

}