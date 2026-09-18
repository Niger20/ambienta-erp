import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateCompraDto,
    CompraDatasource,
    CompraEntity,
    UpdateCompraDto
} from "../../domain";
import prisma from "../../data/postgres";


export class CompraDatasourceImpl implements CompraDatasource {

    async create(dto: CreateCompraDto): Promise<CompraEntity> {
        const compra = await prisma.compras.create({
            data: {
                proveedorid: dto.proveedorid,
                total: dto.total,
                metodopago: dto.metodopago,
                tipocompra: dto.tipocompra,
                facturaproveedor: dto.facturaproveedor,
                fecha: dto.fecha,
                estado: dto.estado,
            },
        });

        return CompraEntity.fromObject(compra);
    }

    async delete(id: number): Promise<CompraEntity> {
        await this.getById(id);

        const updated = await prisma.$transaction(async (tx) => {
            // Get all products from this purchase
            const compraProductos = await tx.comprasproductos.findMany({
                where: { compraid: id },
            });

            // Revert stock for each product (since it was a purchase, decrement stock)
            for (const cp of compraProductos) {
                await tx.productos.update({
                    where: { productoid: cp.productoid },
                    data: {
                        stockactual: {
                            decrement: Number(cp.cantidad),
                        },
                    },
                });
            }

            // Anular cuentas por pagar asociadas a esta compra
            await tx.cuentasporpagar.updateMany({
                where: { compraid: id },
                data: { estado: 'ANULADA' },
            });

            // Soft-delete the purchase
            return tx.compras.update({
                where: { compraid: id },
                data: { estado: false },
            });
        });

        return CompraEntity.fromObject(updated);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<CompraEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            where: { estado: true },
            include: { proveedores: true },
            orderBy: { fecha: 'desc' },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, compras] = await Promise.all([
            prisma.compras.count({ where: { estado: true } }),
            prisma.compras.findMany(findOptions),
        ]);

        return {
            data: compras.map((item) => CompraEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getDeactivated(): Promise<CompraEntity[]> {
        const compras = await prisma.compras.findMany({
            where: { estado: false },
            include: { proveedores: true },
            orderBy: { fecha: 'desc' },
        });
        return compras.map((c) => CompraEntity.fromObject(c));
    }

    async getById(id: number): Promise<CompraEntity | null> {
        const compra = await prisma.compras.findFirst({
            where: { compraid: id },
            include: { proveedores: true },
        });

        if (!compra) throw 'Compra no encontrada';

        return CompraEntity.fromObject(compra);
    }

    async update(dto: UpdateCompraDto): Promise<CompraEntity | null> {
        await this.getById(dto.id);

        const updated = await prisma.$transaction(async (tx) => {
            // 1. Manejar reemplazo y ajuste de stock de líneas si se enviaron
            if (dto.lineas !== undefined) {
                // Obtener líneas antiguas de la compra
                const oldLines = await tx.comprasproductos.findMany({
                    where: { compraid: dto.id },
                });

                // Mapear cantidades antiguas y nuevas por producto
                const oldQtyMap = new Map<number, number>();
                for (const ol of oldLines) {
                    oldQtyMap.set(ol.productoid, Number(ol.cantidad));
                }

                const newQtyMap = new Map<number, number>();
                const newLinesMap = new Map<number, (typeof dto.lineas)[0]>();
                for (const nl of dto.lineas) {
                    newQtyMap.set(nl.productoid, (newQtyMap.get(nl.productoid) || 0) + Number(nl.cantidad));
                    newLinesMap.set(nl.productoid, nl);
                }

                // Obtener todos los IDs de productos afectados (antiguos + nuevos)
                const allProductIds = Array.from(new Set([...oldQtyMap.keys(), ...newQtyMap.keys()]));

                for (const pid of allProductIds) {
                    const oldQty = oldQtyMap.get(pid) || 0;
                    const newQty = newQtyMap.get(pid) || 0;
                    const delta = newQty - oldQty;

                    const prod = await tx.productos.findUnique({ where: { productoid: pid } });
                    if (prod) {
                        const currentStock = Number(prod.stockactual || 0);
                        const newStock = currentStock + delta;

                        const newLine = newLinesMap.get(pid);
                        const updateData: any = {
                            stockactual: newStock,
                        };
                        if (newLine && newLine.preciounitario > 0) {
                            updateData.preciocompra = newLine.preciounitario;
                        }

                        await tx.productos.update({
                            where: { productoid: pid },
                            data: updateData,
                        });

                        if (delta !== 0) {
                            await tx.movimientosinventario.create({
                                data: {
                                    productoid: pid,
                                    tipomovimiento: delta > 0 ? 'INGRESO' : 'SALIDA',
                                    cantidad: Math.abs(delta),
                                    stockanterior: currentStock,
                                    motivo: `Ajuste por Edición de Compra #${dto.id}`,
                                },
                            });
                        }
                    }
                }

                // Eliminar líneas previas e insertar las nuevas
                await tx.comprasproductos.deleteMany({
                    where: { compraid: dto.id },
                });

                for (const l of dto.lineas) {
                    await tx.comprasproductos.create({
                        data: {
                            compraid: dto.id,
                            productoid: l.productoid,
                            cantidad: l.cantidad,
                            preciounitario: l.preciounitario,
                            descuento: l.descuento || 0,
                        },
                    });
                }
            }

            // 2. Manejar costos adicionales si se enviaron
            if (dto.costosAdicionales !== undefined) {
                await tx.costosadicionalescompras.deleteMany({
                    where: { compraid: dto.id },
                });

                for (const ca of dto.costosAdicionales) {
                    if (ca.monto > 0 && ca.concepto.trim()) {
                        await tx.costosadicionalescompras.create({
                            data: {
                                compraid: dto.id,
                                concepto: ca.concepto.trim(),
                                monto: ca.monto,
                            },
                        });
                    }
                }
            }

            // 3. Actualizar la cabecera de la compra
            const comp = await tx.compras.update({
                where: { compraid: dto.id },
                data: dto.values,
                include: { proveedores: true },
            });

            // 4. Sincronizar cuentas por pagar si aplica
            const tipocompra = dto.tipocompra ?? comp.tipocompra;
            const totalCompra = dto.total ?? Number(comp.total);

            if (tipocompra === 'CREDITO') {
                const existingCxp = await tx.cuentasporpagar.findFirst({
                    where: { compraid: dto.id },
                });

                if (existingCxp) {
                    const pagado = Number(existingCxp.montopagado || 0);
                    const restante = Math.max(0, totalCompra - pagado);
                    const nuevoEstado = restante <= 0 ? 'PAGADO' : 'PENDIENTE';

                    const updateCxpData: any = {
                        montototal: totalCompra,
                        estado: nuevoEstado,
                    };
                    if (dto.cuotas != null) updateCxpData.cuotas = dto.cuotas;
                    if (dto.fechavencimiento != null) updateCxpData.fechavencimiento = dto.fechavencimiento;

                    await tx.cuentasporpagar.update({
                        where: { cuentapagarid: existingCxp.cuentapagarid },
                        data: updateCxpData,
                    });
                } else {
                    const vDate = new Date();
                    vDate.setDate(vDate.getDate() + 30);
                    const fVenc = dto.fechavencimiento || vDate.toISOString().split('T')[0];

                    await tx.cuentasporpagar.create({
                        data: {
                            compraid: dto.id,
                            montototal: totalCompra,
                            montopagado: 0,
                            cuotas: dto.cuotas || 1,
                            fechavencimiento: fVenc,
                            estado: 'PENDIENTE',
                        },
                    });
                }
            } else if (tipocompra === 'CONTADO') {
                // Si cambió a CONTADO y tenía cuenta por pagar sin abonos realizados, eliminarla
                const existingCxp = await tx.cuentasporpagar.findFirst({
                    where: { compraid: dto.id },
                });
                if (existingCxp && Number(existingCxp.montopagado) === 0) {
                    await tx.cuentasporpagar.delete({
                        where: { cuentapagarid: existingCxp.cuentapagarid },
                    });
                }
            }

            return comp;
        });

        return CompraEntity.fromObject(updated);
    }

    async getPropuesta(proveedorId: number): Promise<any> {
        const proveedor = await prisma.proveedores.findUnique({
            where: { proveedorid: proveedorId }
        });
        if (!proveedor) throw 'Proveedor no encontrado';

        const products = await prisma.productos.findMany({
            where: {
                comprasproductos: {
                    some: {
                        compras: {
                            proveedorid: proveedorId,
                            estado: true
                        }
                    }
                }
            }
        });

        const productIds = products.map((p) => p.productoid);

        const now = new Date();
        const w1Start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const w2Start = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const w3Start = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

        const sales = await prisma.ventaproductos.findMany({
            where: {
                productoid: { in: productIds },
                ventas: {
                    estado: true,
                    fecha: {
                        gte: w3Start
                    }
                }
            },
            include: {
                ventas: true
            }
        });

        const propuesta = products.map((product) => {
            const productSales = sales.filter((s) => s.productoid === product.productoid);

            let salesW1 = 0;
            let salesW2 = 0;
            let salesW3 = 0;

            productSales.forEach((s) => {
                const saleDate = s.ventas?.fecha ? new Date(s.ventas.fecha) : null;
                if (!saleDate) return;

                if (saleDate >= w1Start) {
                    salesW1 += Number(s.cantidad);
                } else if (saleDate >= w2Start && saleDate < w1Start) {
                    salesW2 += Number(s.cantidad);
                } else if (saleDate >= w3Start && saleDate < w2Start) {
                    salesW3 += Number(s.cantidad);
                }
            });

            const W = salesW1 * 0.5 + salesW2 * 0.3 + salesW3 * 0.2;

            const stockActual = Number(product.stockactual || 0);
            const stockMinimo = Number(product.stockminimo || 0);
            const sugerido = Math.max(0, Math.ceil((W + stockMinimo) - stockActual));

            return {
                productoid: product.productoid,
                nombre: product.nombre,
                preciocompra: Number(product.preciocompra),
                stockactual: stockActual,
                stockminimo: stockMinimo,
                ventasSemana1: salesW1,
                ventasSemana2: salesW2,
                ventasSemana3: salesW3,
                promedioPonderado: W,
                sugerido: sugerido
            };
        });

        return {
            proveedor: {
                id: proveedor.proveedorid,
                nombreempresa: proveedor.nombreempresa,
                asesorventas: proveedor.asesorventas,
                telefono: proveedor.telefono,
                direccion: proveedor.direccion
            },
            propuesta
        };
    }

    async getPropuestaGlobal(): Promise<any> {
        const products = await prisma.productos.findMany({
            include: {
                categoriasproductos: true
            }
        });

        const productIds = products.map((p) => p.productoid);

        const now = new Date();
        const w1Start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const w2Start = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const w3Start = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

        const sales = await prisma.ventaproductos.findMany({
            where: {
                productoid: { in: productIds },
                ventas: {
                    estado: true,
                    fecha: {
                        gte: w3Start
                    }
                }
            },
            include: {
                ventas: true
            }
        });

        const allPropuestas = products.map((product) => {
            const productSales = sales.filter((s) => s.productoid === product.productoid);

            let salesW1 = 0;
            let salesW2 = 0;
            let salesW3 = 0;

            productSales.forEach((s) => {
                const saleDate = s.ventas?.fecha ? new Date(s.ventas.fecha) : null;
                if (!saleDate) return;

                if (saleDate >= w1Start) {
                    salesW1 += Number(s.cantidad);
                } else if (saleDate >= w2Start && saleDate < w1Start) {
                    salesW2 += Number(s.cantidad);
                } else if (saleDate >= w3Start && saleDate < w2Start) {
                    salesW3 += Number(s.cantidad);
                }
            });

            const W = salesW1 * 0.5 + salesW2 * 0.3 + salesW3 * 0.2;
            const stockActual = Number(product.stockactual || 0);
            const stockMinimo = Number(product.stockminimo || 0);
            const sugerido = Math.max(0, Math.ceil((W + stockMinimo) - stockActual));
            const precioCompra = Number(product.preciocompra || 0);
            const costoTotalEstimado = Math.round((sugerido * precioCompra) * 100) / 100;

            const totalNecesitado = W + stockMinimo;
            const stockRatio = totalNecesitado > 0 ? (stockActual / totalNecesitado) : (stockActual <= 0 ? -1 : 1);

            let prioridad: 'CRÍTICA' | 'ALTA' | 'MEDIA' = 'MEDIA';
            if (stockActual <= 0) {
                prioridad = 'CRÍTICA';
            } else if (stockRatio < 0.5) {
                prioridad = 'ALTA';
            }

            return {
                productoid: product.productoid,
                codigobarra: product.codigobarra || '',
                nombre: product.nombre,
                categoria: (product as any).categoriasproductos?.nombre || 'Sin Categoría',
                preciocompra: precioCompra,
                precioventa: Number(product.precioventa || 0),
                stockactual: stockActual,
                stockminimo: stockMinimo,
                ventasSemana1: salesW1,
                ventasSemana2: salesW2,
                ventasSemana3: salesW3,
                promedioPonderado: Math.round(W * 100) / 100,
                sugerido: sugerido,
                costoTotalEstimado: costoTotalEstimado,
                prioridad: prioridad,
                stockRatio: stockRatio
            };
        });

        // Filtrar unicamente los que necesitan pedido (sugerido > 0)
        const soloNecesitados = allPropuestas.filter((item) => item.sugerido > 0);

        // Ordenar de mas necesarios a menos necesarios:
        // 1. Productos con stock <= 0 (CRÍTICA) primero
        // 2. Menor stockRatio (porcentaje de stock cubierto) primero
        // 3. Mayor sugerido (cantidad a pedir) descendente como desempate
        soloNecesitados.sort((a, b) => {
            if (a.stockactual <= 0 && b.stockactual > 0) return -1;
            if (a.stockactual > 0 && b.stockactual <= 0) return 1;
            if (a.stockRatio !== b.stockRatio) return a.stockRatio - b.stockRatio;
            return b.sugerido - a.sugerido;
        });

        const totalProductosNecesitados = soloNecesitados.length;
        const totalUnidadesSugeridas = soloNecesitados.reduce((sum, item) => sum + item.sugerido, 0);
        const inversionTotalEstimada = Math.round(soloNecesitados.reduce((sum, item) => sum + item.costoTotalEstimado, 0) * 100) / 100;
        const totalCriticos = soloNecesitados.filter((item) => item.stockactual <= 0).length;

        return {
            resumen: {
                totalProductosNecesitados,
                totalUnidadesSugeridas,
                inversionTotalEstimada,
                totalCriticos,
                fechaGeneracion: new Date()
            },
            propuesta: soloNecesitados
        };
    }
}
