import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateOrdenCompraProductoDto } from "../../domain/dtos/orden-compra-producto/create-orden-compra-producto.dto";
import { UpdateOrdenCompraProductoDto } from "../../domain/dtos/orden-compra-producto/update-orden-compra-producto.dto";
import { OrdenCompraProductoDatasource } from "../../domain/datasources/orden-compra-producto.datasource";
import { OrdenCompraProductoEntity } from "../../domain/entitites/orden-compra-producto.entity";
import prisma from "../../data/postgres";

export class OrdenCompraProductoDatasourceImpl implements OrdenCompraProductoDatasource {

    async create(dto: CreateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity> {
        const [orden, producto] = await Promise.all([
            prisma.ordenescompra.findUnique({ where: { ordencompraid: dto.ordencompraid } }),
            prisma.productos.findUnique({ where: { productoid: dto.productoid } }),
        ]);
        if (!orden) throw 'La orden de compra especificada no existe';
        if (!producto) throw 'El producto especificado no existe';

        const record = await prisma.ordenescompraproductos.create({
            data: {
                ordencompraid: dto.ordencompraid,
                productoid: dto.productoid,
                cantidadordenada: dto.cantidadordenada,
                preciounitario: dto.preciounitario,
            },
            include: { productos: true }
        });
        return OrdenCompraProductoEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, ordencompraid?: number): Promise<PaginatedResult<OrdenCompraProductoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (ordencompraid) where.ordencompraid = ordencompraid;

        const findOptions: any = {
            where,
            include: { productos: true },
            orderBy: { productoid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.ordenescompraproductos.count({ where }),
            prisma.ordenescompraproductos.findMany(findOptions),
        ]);

        return {
            data: records.map(r => OrdenCompraProductoEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity | null> {
        const record = await prisma.ordenescompraproductos.findUnique({
            where: {
                ordencompraid_productoid: {
                    ordencompraid,
                    productoid,
                }
            },
            include: { productos: true }
        });
        if (!record) throw 'Producto de orden de compra no encontrado';
        return OrdenCompraProductoEntity.fromObject(record);
    }

    async update(dto: UpdateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity | null> {
        await this.getById(dto.ordencompraid, dto.productoid);
        const updated = await prisma.ordenescompraproductos.update({
            where: {
                ordencompraid_productoid: {
                    ordencompraid: dto.ordencompraid,
                    productoid: dto.productoid,
                }
            },
            data: dto.values,
            include: { productos: true }
        });
        return OrdenCompraProductoEntity.fromObject(updated);
    }

    async delete(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity> {
        await this.getById(ordencompraid, productoid);
        const deleted = await prisma.ordenescompraproductos.delete({
            where: {
                ordencompraid_productoid: {
                    ordencompraid,
                    productoid,
                }
            },
            include: { productos: true }
        });
        return OrdenCompraProductoEntity.fromObject(deleted);
    }
}
