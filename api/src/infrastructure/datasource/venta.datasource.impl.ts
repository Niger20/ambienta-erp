import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateVentaDto,
    VentaDatasource,
    VentaEntity,
    UpdateVentaDto
} from "../../domain";
import prisma from "../../data/postgres";

export class VentaDatasourceImpl implements VentaDatasource {

    async create(createVentaDto: CreateVentaDto): Promise<VentaEntity> {
        const venta = await prisma.ventas.create({
            data: {
                clienteid: createVentaDto.clienteid,
                sesionid: createVentaDto.sesionid,
                total: createVentaDto.total,
                tipoventa: createVentaDto.tipoventa,
                lugarventa: createVentaDto.lugarventa,
                fecha: createVentaDto.fecha,
                estado: createVentaDto.estado,
                tipofactura: (createVentaDto as any).tipofactura ?? null,
            },
            include: {
                clientes: true,
            },
        });

        return VentaEntity.fromObject(venta);
    }

    async delete(id: number): Promise<VentaEntity> {
        const currentVenta = await this.getById(id);
        if (!currentVenta) throw 'Venta no encontrada';

        const updatedVenta = await prisma.$transaction(async (tx) => {
            // Revert stock for each product ONLY if it was not a cotizacion
            if (currentVenta.tipoventa !== 'COTIZACION') {
                const ventaProductos = await tx.ventaproductos.findMany({
                    where: { ventaid: id },
                });

                for (const vp of ventaProductos) {
                    await tx.productos.update({
                        where: { productoid: vp.productoid },
                        data: {
                            stockactual: {
                                increment: Number(vp.cantidad),
                            },
                        },
                    });
                }
            }

            // Anular cuentas por cobrar asociadas a esta venta
            await tx.cuentasporcobrar.updateMany({
                where: { ventaid: id },
                data: { estado: 'ANULADA' },
            });

            // Soft-delete the sale
            return tx.ventas.update({
                where: { ventaid: id },
                data: { estado: false },
                include: {
                    clientes: true,
                },
            });
        });

        return VentaEntity.fromObject(updatedVenta);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<VentaEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            where: { estado: true },
            include: {
                clientes: true,
            },
            orderBy: {
                fecha: 'desc',
            },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, ventas] = await Promise.all([
            prisma.ventas.count({ where: { estado: true } }),
            prisma.ventas.findMany(findOptions),
        ]);

        return {
            data: ventas.map((venta) => VentaEntity.fromObject(venta)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getDeactivated(): Promise<VentaEntity[]> {
        const ventas = await prisma.ventas.findMany({
            where: { estado: false },
            include: {
                clientes: true,
            },
            orderBy: {
                fecha: 'desc',
            },
        });
        return ventas.map((venta) => VentaEntity.fromObject(venta));
    }

    async getById(id: number): Promise<VentaEntity | null> {
        const venta = await prisma.ventas.findFirst({
            where: { ventaid: id },
            include: {
                clientes: true,
            },
        });

        if (!venta) throw 'Venta no encontrada';

        return VentaEntity.fromObject(venta);
    }

    async update(updateVentaDto: UpdateVentaDto): Promise<VentaEntity | null> {
        const currentVenta = await this.getById(updateVentaDto.id);
        if (!currentVenta) throw 'Venta no encontrada';

        return await prisma.$transaction(async (tx) => {
            // Si pasa de COTIZACION a venta formal (CONTADO o CREDITO), descontar el stock
            if (currentVenta.tipoventa === 'COTIZACION' && updateVentaDto.tipoventa && updateVentaDto.tipoventa !== 'COTIZACION') {
                const ventaProductos = await tx.ventaproductos.findMany({
                    where: { ventaid: updateVentaDto.id },
                });

                for (const vp of ventaProductos) {
                    const prod = await tx.productos.findUnique({ where: { productoid: vp.productoid } });
                    if (prod) {
                        const currentStock = Number(prod.stockactual || 0);
                        const soldQty = Number(vp.cantidad);
                        const newStock = Math.max(0, currentStock - soldQty);

                        await tx.productos.update({
                            where: { productoid: vp.productoid },
                            data: { stockactual: newStock },
                        });

                        const mov = await tx.movimientosinventario.create({
                            data: {
                                productoid: vp.productoid,
                                tipomovimiento: 'EGRESO',
                                cantidad: -Math.abs(soldQty),
                                stockanterior: currentStock,
                                motivo: `Facturación Cotización #${updateVentaDto.id}`,
                            },
                        });

                        await tx.movimientoventas.create({
                            data: {
                                movimeintoventaid: mov.movimientoid,
                                ventaid: updateVentaDto.id,
                            },
                        });
                    }
                }
            }

            const updatedVenta = await tx.ventas.update({
                where: { ventaid: updateVentaDto.id },
                data: updateVentaDto.values,
                include: {
                    clientes: true,
                },
            });

            return VentaEntity.fromObject(updatedVenta);
        });
    }
}
