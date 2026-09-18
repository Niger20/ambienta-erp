import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateImagenProductoDto } from "../../domain/dtos/imagen-producto/create-imagen-producto.dto";
import { UpdateImagenProductoDto } from "../../domain/dtos/imagen-producto/update-imagen-producto.dto";
import { ImagenProductoDatasource } from "../../domain/datasources/imagen-producto.datasource";
import { ImagenProductoEntity } from "../../domain/entitites/imagen-producto.entity";
import prisma from "../../data/postgres";

export class ImagenProductoDatasourceImpl implements ImagenProductoDatasource {

    async create(dto: CreateImagenProductoDto): Promise<ImagenProductoEntity> {
        const producto = await prisma.productos.findUnique({
            where: { productoid: dto.productoid }
        });
        if (!producto) throw 'El producto especificado no existe';

        if (dto.esprincipal) {
            await prisma.imagenesproductos.updateMany({
                where: { productoid: dto.productoid },
                data: { esprincipal: false }
            });
        }

        const record = await prisma.imagenesproductos.create({
            data: {
                productoid: dto.productoid,
                urlimagen: dto.urlimagen,
                esprincipal: dto.esprincipal,
            },
            include: { productos: true }
        });
        return ImagenProductoEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, productoid?: number): Promise<PaginatedResult<ImagenProductoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (productoid) where.productoid = productoid;

        const findOptions: any = {
            where,
            include: { productos: true },
            orderBy: { imagenid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.imagenesproductos.count({ where }),
            prisma.imagenesproductos.findMany(findOptions),
        ]);

        return {
            data: records.map(r => ImagenProductoEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<ImagenProductoEntity | null> {
        const record = await prisma.imagenesproductos.findFirst({
            where: { imagenid: id },
            include: { productos: true }
        });
        if (!record) throw 'Imagen no encontrada';
        return ImagenProductoEntity.fromObject(record);
    }

    async update(dto: UpdateImagenProductoDto): Promise<ImagenProductoEntity | null> {
        const existing = await this.getById(dto.id);
        const targetProductoId = dto.productoid ?? existing!.productoid;

        if (dto.esprincipal) {
            await prisma.imagenesproductos.updateMany({
                where: { productoid: targetProductoId },
                data: { esprincipal: false }
            });
        }

        const updated = await prisma.imagenesproductos.update({
            where: { imagenid: dto.id },
            data: dto.values,
            include: { productos: true }
        });
        return ImagenProductoEntity.fromObject(updated);
    }

    async delete(id: number): Promise<ImagenProductoEntity> {
        await this.getById(id);
        const deleted = await prisma.imagenesproductos.delete({
            where: { imagenid: id },
            include: { productos: true }
        });
        return ImagenProductoEntity.fromObject(deleted);
    }
}
