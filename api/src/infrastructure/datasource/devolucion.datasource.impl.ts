import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateDevolucionDto } from "../../domain/dtos/devolucion/create-devolucion.dto";
import { UpdateDevolucionDto } from "../../domain/dtos/devolucion/update-devolucion.dto";
import { DevolucionDatasource } from "../../domain/datasources/devolucion.datasource";
import { DevolucionEntity } from "../../domain/entitites/devolucion.entity";
import prisma from "../../data/postgres";

export class DevolucionDatasourceImpl implements DevolucionDatasource {

    async create(dto: CreateDevolucionDto): Promise<DevolucionEntity> {
        const venta = await prisma.ventas.findUnique({
            where: { ventaid: dto.ventaid }
        });
        if (!venta) throw 'La venta especificada no existe';

        const producto = await prisma.productos.findUnique({
            where: { productoid: dto.productoid }
        });
        if (!producto) throw 'El producto especificado no existe';

        const usuario = await prisma.usuarios.findUnique({
            where: { usuarioid: dto.usuarioid }
        });
        if (!usuario) throw 'El usuario especificado no existe';

        const record = await prisma.$transaction(async (tx) => {
            // Incrementar stock
            await tx.productos.update({
                where: { productoid: dto.productoid },
                data: {
                    stockactual: {
                        increment: dto.cantidad,
                    }
                }
            });

            // Registrar movimiento de inventario
            await tx.movimientosinventario.create({
                data: {
                    productoid: dto.productoid,
                    tipomovimiento: 'ENTRADA',
                    cantidad: dto.cantidad,
                    stockanterior: producto.stockactual ?? 0,
                    motivo: `DEVOLUCION VENTA #${dto.ventaid}: ${dto.motivo}`,
                    fecha: dto.fecha,
                }
            });

            // Crear devolucion
            return tx.devoluciones.create({
                data: {
                    ventaid: dto.ventaid,
                    productoid: dto.productoid,
                    cantidad: dto.cantidad,
                    motivo: dto.motivo,
                    montodevuelto: dto.montodevuelto,
                    usuarioid: dto.usuarioid,
                    fecha: dto.fecha,
                },
                include: {
                    usuarios: true,
                    ventaproductos: {
                        include: { productos: true }
                    }
                }
            });
        });

        return DevolucionEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, ventaid?: number, productoid?: number): Promise<PaginatedResult<DevolucionEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (ventaid) where.ventaid = ventaid;
        if (productoid) where.productoid = productoid;

        const findOptions: any = {
            where,
            include: {
                usuarios: true,
                ventaproductos: {
                    include: { productos: true }
                }
            },
            orderBy: { devolucionid: 'desc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.devoluciones.count({ where }),
            prisma.devoluciones.findMany(findOptions),
        ]);

        return {
            data: records.map(r => DevolucionEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<DevolucionEntity | null> {
        const record = await prisma.devoluciones.findFirst({
            where: { devolucionid: id },
            include: {
                usuarios: true,
                ventaproductos: {
                    include: { productos: true }
                }
            }
        });
        if (!record) throw 'Devolución no encontrada';
        return DevolucionEntity.fromObject(record);
    }

    async update(dto: UpdateDevolucionDto): Promise<DevolucionEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.devoluciones.update({
            where: { devolucionid: dto.id },
            data: dto.values,
            include: {
                usuarios: true,
                ventaproductos: {
                    include: { productos: true }
                }
            }
        });
        return DevolucionEntity.fromObject(updated);
    }

    async delete(id: number): Promise<DevolucionEntity> {
        const existing = await this.getById(id);
        const deleted = await prisma.$transaction(async (tx) => {
            // Revertir stock
            await tx.productos.update({
                where: { productoid: existing!.productoid },
                data: {
                    stockactual: {
                        decrement: existing!.cantidad,
                    }
                }
            });

            return tx.devoluciones.delete({
                where: { devolucionid: id },
                include: {
                    usuarios: true,
                    ventaproductos: true
                }
            });
        });

        return DevolucionEntity.fromObject(deleted);
    }
}
