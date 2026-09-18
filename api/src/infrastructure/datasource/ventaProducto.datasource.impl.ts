import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateVentaProductoDto,
    VentaProductoDatasource,
    VentaProductoEntity,
} from "../../domain";
import prisma from "../../data/postgres";

export class VentaProductoDatasourceImpl implements VentaProductoDatasource {

    async create(dto: CreateVentaProductoDto): Promise<VentaProductoEntity> {
        return prisma.$transaction(async (tx) => {
            const venta = await tx.ventas.findUnique({
                where: { ventaid: dto.ventaid },
            });

            if (!venta) throw 'Venta no encontrada';

            const producto = await tx.productos.findUnique({
                where: { productoid: dto.productoid },
            });

            if (!producto) throw 'Producto no encontrado';

            let preciounitario = dto.preciounitario;
            if (preciounitario == null) {
                preciounitario = Number(producto.precioventa);
            }

            const descuento = dto.descuento ?? 0;
            const currentStock = Number(producto.stockactual || 0);
            const soldQty = Number(dto.cantidad);

            // 1. Crear el registro en ventaproductos
            const ventaProducto = await tx.ventaproductos.create({
                data: {
                    ventaid: dto.ventaid,
                    productoid: dto.productoid,
                    cantidad: dto.cantidad,
                    preciounitario: preciounitario,
                    descuento: descuento,
                },
            });

            // 2. Si la venta NO es una cotización, descontar stock y registrar movimiento
            if (venta.tipoventa !== 'COTIZACION') {
                const newStock = Math.max(0, currentStock - soldQty);

                await tx.productos.update({
                    where: { productoid: dto.productoid },
                    data: {
                        stockactual: newStock,
                    },
                });

                // Registrar movimiento de inventario (EGRESO)
                const mov = await tx.movimientosinventario.create({
                    data: {
                        productoid: dto.productoid,
                        tipomovimiento: 'EGRESO',
                        cantidad: -Math.abs(soldQty),
                        stockanterior: currentStock,
                        motivo: `Venta #${dto.ventaid}`,
                    },
                });

                // Registrar en movimientoventas
                await tx.movimientoventas.create({
                    data: {
                        movimeintoventaid: mov.movimientoid,
                        ventaid: dto.ventaid,
                    },
                });
            }

            return VentaProductoEntity.fromObject(ventaProducto);
        });
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<VentaProductoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.ventaproductos.count(),
            prisma.ventaproductos.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => VentaProductoEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getByVentaId(ventaid: number): Promise<VentaProductoEntity[]> {
        const records = await prisma.ventaproductos.findMany({
            where: { ventaid },
            include: { productos: true },
        });
        return records.map((r) => VentaProductoEntity.fromObject(r));
    }

    async delete(ventaid: number, productoid: number): Promise<VentaProductoEntity> {
        return prisma.$transaction(async (tx) => {
            const venta = await tx.ventas.findUnique({ where: { ventaid } });
            const ventaProducto = await tx.ventaproductos.delete({
                where: {
                    ventaid_productoid: { ventaid, productoid },
                },
            });

            // If it was not a cotizacion, increment stock back
            if (venta && venta.tipoventa !== 'COTIZACION') {
                await tx.productos.update({
                    where: { productoid },
                    data: {
                        stockactual: {
                            increment: Number(ventaProducto.cantidad),
                        },
                    },
                });
            }

            return VentaProductoEntity.fromObject(ventaProducto);
        });
    }
}
