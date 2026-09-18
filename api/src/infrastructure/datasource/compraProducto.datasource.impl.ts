import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateCompraProductoDto,
    CompraProductoDatasource,
    CompraProductoEntity,
} from "../../domain";
import prisma from "../../data/postgres";


export class CompraProductoDatasourceImpl implements CompraProductoDatasource {

    async create(dto: CreateCompraProductoDto): Promise<CompraProductoEntity> {
        return prisma.$transaction(async (tx) => {
            const producto = await tx.productos.findUnique({
                where: { productoid: dto.productoid },
            });

            if (!producto) throw 'Producto no encontrado';

            let preciounitario = dto.preciounitario;
            if (preciounitario == null) {
                preciounitario = Number(producto.preciocompra);
            }

            const currentStock = Number(producto.stockactual || 0);
            const currentCost = Number(producto.preciocompra || 0);
            const purchasedQty = Number(dto.cantidad);
            const purchaseUnitPrice = Number(preciounitario);

            // Ponderacion del precio de compra (Costo Promedio Ponderado / Moving Average Cost)
            let newWeightedCost = currentCost;
            if (currentStock > 0) {
                const totalUnits = currentStock + purchasedQty;
                if (totalUnits > 0) {
                    newWeightedCost = ((currentStock * currentCost) + (purchasedQty * purchaseUnitPrice)) / totalUnits;
                } else {
                    newWeightedCost = purchaseUnitPrice;
                }
            } else {
                newWeightedCost = purchaseUnitPrice;
            }
            newWeightedCost = Math.round(newWeightedCost * 100) / 100;

            const descuento = dto.descuento ?? 0;
            const newStock = currentStock + purchasedQty;

            // 1. Crear registro de comprasproductos
            const record = await tx.comprasproductos.create({
                data: {
                    compraid: dto.compraid,
                    productoid: dto.productoid,
                    cantidad: dto.cantidad,
                    preciounitario: preciounitario,
                    descuento: descuento,
                },
                include: { productos: true },
            });

            // 2. Actualizar precio de compra ponderado y stockactual del producto
            await tx.productos.update({
                where: { productoid: dto.productoid },
                data: {
                    preciocompra: newWeightedCost,
                    stockactual: newStock,
                },
            });

            // 3. Crear movimiento de inventario (INGRESO)
            const mov = await tx.movimientosinventario.create({
                data: {
                    productoid: dto.productoid,
                    tipomovimiento: 'INGRESO',
                    cantidad: dto.cantidad,
                    stockanterior: currentStock,
                    motivo: `Compra #${dto.compraid}`,
                },
            });

            // 4. Crear relación movimientoscompras
            await tx.movimientoscompras.create({
                data: {
                    movimientocompraid: mov.movimientoid,
                    compraid: dto.compraid,
                },
            });

            return CompraProductoEntity.fromObject(record);
        });
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<CompraProductoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            include: { productos: true },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.comprasproductos.count(),
            prisma.comprasproductos.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => CompraProductoEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getByCompraId(compraid: number): Promise<CompraProductoEntity[]> {
        const records = await prisma.comprasproductos.findMany({
            where: { compraid },
            include: { productos: true },
        });
        return records.map((r) => CompraProductoEntity.fromObject(r));
    }

    async delete(compraid: number, productoid: number): Promise<CompraProductoEntity> {
        return prisma.$transaction(async (tx) => {
            const record = await tx.comprasproductos.delete({
                where: {
                    compraid_productoid: { compraid, productoid },
                },
                include: { productos: true },
            });

            // Decrement stock
            await tx.productos.update({
                where: { productoid },
                data: {
                    stockactual: {
                        decrement: Number(record.cantidad),
                    },
                },
            });

            return CompraProductoEntity.fromObject(record);
        });
    }
}
