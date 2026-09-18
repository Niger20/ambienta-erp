import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateProductCategoryDto,
    ProductCategoryDataSource,
    ProductCategoryEntity,
    UpdateProductCategoryDto
} from "../../domain";
import prisma from "../../data/postgres";


export class ProductCategoryDatasourceImpl implements  ProductCategoryDataSource{
    async create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategoryEntity> {
        const categoriasProducto = await prisma.categoriasproductos.create({
            data: {
                nombre: createProductCategoryDto!.nombre,
                descripcion: createProductCategoryDto!.descripcion,
            }
        })

        return ProductCategoryEntity.fromObject(categoriasProducto);
    }

    async delete(id: number): Promise<ProductCategoryEntity> {

        await this.getById( id )

        const deletedCategoriaProducto = await prisma.categoriasproductos.delete({
            where: { categoriaid: id }
        });

        return ProductCategoryEntity.fromObject(deletedCategoriaProducto);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<ProductCategoryEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, categoriasProducto] = await Promise.all([
            prisma.categoriasproductos.count(),
            prisma.categoriasproductos.findMany(findOptions),
        ]);

        return {
            data: categoriasProducto.map((item) => ProductCategoryEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getById(id: number): Promise<ProductCategoryEntity | null> {
        const categoriaProducto = await prisma.categoriasproductos.findFirst({
            where: { categoriaid: id }
        });

        if (!categoriaProducto) throw 'Product Category not found';

        return ProductCategoryEntity.fromObject(categoriaProducto);
    }

    async update(updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategoryEntity | null> {
        await this.getById( updateProductCategoryDto.id )

        const updatedCategoriaProducto = await prisma.categoriasproductos.update({
            where: { categoriaid: updateProductCategoryDto.id },
            data: updateProductCategoryDto!.values
        });

        return ProductCategoryEntity.fromObject(updatedCategoriaProducto);

    }



}