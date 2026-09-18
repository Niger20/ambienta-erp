import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateOrdenCompraDto } from "../../domain/dtos/orden-compra/create-orden-compra.dto";
import { UpdateOrdenCompraDto } from "../../domain/dtos/orden-compra/update-orden-compra.dto";
import { OrdenCompraDatasource } from "../../domain/datasources/orden-compra.datasource";
import { OrdenCompraEntity } from "../../domain/entitites/orden-compra.entity";
import prisma from "../../data/postgres";

export class OrdenCompraDatasourceImpl implements OrdenCompraDatasource {

    async create(dto: CreateOrdenCompraDto): Promise<OrdenCompraEntity> {
        const proveedor = await prisma.proveedores.findUnique({
            where: { proveedorid: dto.proveedorid }
        });
        if (!proveedor) throw 'El proveedor especificado no existe';

        const record = await prisma.ordenescompra.create({
            data: {
                proveedorid: dto.proveedorid,
                estado: dto.estado,
                fechaorden: dto.fechaorden,
                fechaesperada: dto.fechaesperada,
            },
            include: {
                proveedores: true,
                ordenescompraproductos: {
                    include: { productos: true }
                }
            }
        });
        return OrdenCompraEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, proveedorid?: number, estado?: string): Promise<PaginatedResult<OrdenCompraEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (proveedorid) where.proveedorid = proveedorid;
        if (estado) where.estado = { equals: estado, mode: 'insensitive' };

        const findOptions: any = {
            where,
            include: {
                proveedores: true,
                ordenescompraproductos: {
                    include: { productos: true }
                }
            },
            orderBy: { ordencompraid: 'desc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.ordenescompra.count({ where }),
            prisma.ordenescompra.findMany(findOptions),
        ]);

        return {
            data: records.map(r => OrdenCompraEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<OrdenCompraEntity | null> {
        const record = await prisma.ordenescompra.findFirst({
            where: { ordencompraid: id },
            include: {
                proveedores: true,
                ordenescompraproductos: {
                    include: { productos: true }
                }
            }
        });
        if (!record) throw 'Orden de compra no encontrada';
        return OrdenCompraEntity.fromObject(record);
    }

    async update(dto: UpdateOrdenCompraDto): Promise<OrdenCompraEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.ordenescompra.update({
            where: { ordencompraid: dto.id },
            data: dto.values,
            include: {
                proveedores: true,
                ordenescompraproductos: {
                    include: { productos: true }
                }
            }
        });
        return OrdenCompraEntity.fromObject(updated);
    }

    async delete(id: number): Promise<OrdenCompraEntity> {
        await this.getById(id);
        const deleted = await prisma.$transaction(async (tx) => {
            await tx.ordenescompraproductos.deleteMany({
                where: { ordencompraid: id }
            });
            return tx.ordenescompra.delete({
                where: { ordencompraid: id },
                include: {
                    proveedores: true,
                    ordenescompraproductos: true
                }
            });
        });
        return OrdenCompraEntity.fromObject(deleted);
    }
}
