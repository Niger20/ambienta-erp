import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateProductoDto,
    ProductoDatasource,
    ProductoEntity,
    UpdateProductoDto
} from "../../domain";
import prisma from "../../data/postgres";


export class ProductoDatasourceImpl implements ProductoDatasource {

    async create(createProductoDto: CreateProductoDto): Promise<ProductoEntity> {
        const unidadmedidaid = createProductoDto.unidadmedidaid ?? 1;
        const producto = await prisma.productos.create({
            data: {
                nombre: createProductoDto.nombre,
                codigobarra: createProductoDto.codigobarra,
                categoriaid: createProductoDto.categoriaid,
                unidadmedidaid: unidadmedidaid,
                descripcion: createProductoDto.descripcion,
                preciocompra: createProductoDto.preciocompra,
                precioventa: createProductoDto.precioventa,
                preciomayoreo: createProductoDto.preciomayoreo ?? null,
                cantidadminimamayoreo: createProductoDto.cantidadminimamayoreo ?? null,
                stockminimo: createProductoDto.stockminimo ?? 0,
                stockactual: createProductoDto.stockactual ?? 0,
                requierefechavencimiento: createProductoDto.requierefechavencimiento ?? false,
                fechavencimiento: createProductoDto.fechavencimiento,
                publicadoencatalogo: createProductoDto.publicadoencatalogo ?? false,
            },
            include: {
                categoriasproductos: true,
            },
        });

        return ProductoEntity.fromObject(producto);
    }

    async delete(id: number): Promise<ProductoEntity> {
        await this.getById(id);

        try {
            const deletedProducto = await prisma.productos.delete({
                where: { productoid: id },
                include: {
                    categoriasproductos: true,
                },
            });

            return ProductoEntity.fromObject(deletedProducto);
        } catch (error: any) {
            throw 'No se puede eliminar el producto porque tiene movimientos o registros vinculados en el sistema.';
        }
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<ProductoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            include: {
                categoriasproductos: true,
            },
            orderBy: {
                productoid: 'asc',
            },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, productos] = await Promise.all([
            prisma.productos.count(),
            prisma.productos.findMany(findOptions),
        ]);

        return {
            data: productos.map((item) => ProductoEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getDeactivated(): Promise<ProductoEntity[]> {
        return [];
    }

    async getById(id: number): Promise<ProductoEntity | null> {
        const producto = await prisma.productos.findFirst({
            where: { productoid: id },
            include: {
                categoriasproductos: true,
            },
        });

        if (!producto) throw 'Producto not found';

        return ProductoEntity.fromObject(producto);
    }

    async getByBarcode(codigobarra: string): Promise<ProductoEntity | null> {
        const producto = await prisma.productos.findFirst({
            where: { codigobarra: codigobarra },
            include: {
                categoriasproductos: true,
            },
        });

        if (!producto) throw 'Producto not found';

        return ProductoEntity.fromObject(producto);
    }

    async update(updateProductoDto: UpdateProductoDto): Promise<ProductoEntity | null> {
        await this.getById(updateProductoDto.id);

        const updatedProducto = await prisma.productos.update({
            where: { productoid: updateProductoDto.id },
            data: updateProductoDto.values,
            include: {
                categoriasproductos: true,
            },
        });

        return ProductoEntity.fromObject(updatedProducto);
    }

    async searchByName(query: string): Promise<ProductoEntity[]> {
        const productos = await prisma.productos.findMany({
            where: {
                nombre: { contains: query, mode: 'insensitive' },
            },
            include: {
                categoriasproductos: true,
            },
            take: 20,
        });
        return productos.map((producto) => ProductoEntity.fromObject(producto));
    }

    async recalculateStockMinimo(): Promise<void> {
        await prisma.$executeRaw`SELECT fn_recalcular_stock_minimo_global();`;
    }
}