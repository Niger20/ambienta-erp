import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateMovimientoInventarioDto,
    MovimientoInventarioDatasource,
    MovimientoInventarioEntity,
} from "../../domain";
import prisma from "../../data/postgres";


export class MovimientoInventarioDatasourceImpl implements MovimientoInventarioDatasource {

    async create(dto: CreateMovimientoInventarioDto): Promise<MovimientoInventarioEntity> {
        const isIngreso = dto.tipomovimiento ? dto.tipomovimiento.trim().toUpperCase() === 'INGRESO' : true;
        const cantidad = Math.abs(Number(dto.cantidad));
        const stockChange = isIngreso ? cantidad : -cantidad;

        return await prisma.$transaction(async (tx) => {
            const producto = await tx.productos.findFirst({
                where: { productoid: dto.productoid },
            });

            if (!producto) throw 'Producto no encontrado';

            const currentStock = Number(producto.stockactual || 0);
            const stockanterior = dto.stockanterior != null ? Number(dto.stockanterior) : currentStock;
            const newStock = Math.max(0, currentStock + stockChange);

            // Actualizar stock del producto
            await tx.productos.update({
                where: { productoid: dto.productoid },
                data: {
                    stockactual: newStock,
                },
            });

            const record = await tx.movimientosinventario.create({
                data: {
                    productoid: dto.productoid,
                    tipomovimiento: dto.tipomovimiento,
                    cantidad: dto.cantidad,
                    motivo: dto.motivo,
                    stockanterior: stockanterior,
                },
                include: {
                    productos: true,
                },
            });

            return MovimientoInventarioEntity.fromObject(record);
        });
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<MovimientoInventarioEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            where: {
                movimientoventas: {
                    none: {
                        ventas: {
                            estado: false
                        }
                    }
                },
                movimientoscompras: {
                    none: {
                        compras: {
                            estado: false
                        }
                    }
                }
            },
            include: {
                productos: true,
                movimientoventas: true,
                movimientoscompras: true,
            },
            orderBy: { fecha: 'desc' },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.movimientosinventario.count({ where: {
                movimientoventas: {
                    none: {
                        ventas: {
                            estado: false
                        }
                    }
                },
                movimientoscompras: {
                    none: {
                        compras: {
                            estado: false
                        }
                    }
                }
            } }),
            prisma.movimientosinventario.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => MovimientoInventarioEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getById(id: number): Promise<MovimientoInventarioEntity | null> {
        const record = await prisma.movimientosinventario.findFirst({
            where: { movimientoid: id },
            include: {
                productos: true,
                movimientoventas: true,
                movimientoscompras: true,
            },
        });

        if (!record) throw 'Movimiento de inventario no encontrado';

        return record ? MovimientoInventarioEntity.fromObject(record) : null;
    }

    async getByProductoId(productoid: number): Promise<MovimientoInventarioEntity[]> {
        const records = await prisma.movimientosinventario.findMany({
            where: {
                productoid,
                movimientoventas: {
                    none: {
                        ventas: {
                            estado: false
                        }
                    }
                },
                movimientoscompras: {
                    none: {
                        compras: {
                            estado: false
                        }
                    }
                }
            },
            include: {
                productos: true,
                movimientoventas: true,
                movimientoscompras: true,
            },
            orderBy: { fecha: 'desc' },
        });
        return records.map((r) => MovimientoInventarioEntity.fromObject(r));
    }

    async delete(id: number): Promise<MovimientoInventarioEntity> {
        await this.getById(id);

        const record = await prisma.movimientosinventario.delete({
            where: { movimientoid: id },
            include: { productos: true },
        });

        return MovimientoInventarioEntity.fromObject(record);
    }
}
