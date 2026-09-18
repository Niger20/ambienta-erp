import { ReportesDatasource, UtilidadDiariaEntity, UtilidadProductoEntity } from "../../../domain";
import prisma from "../../../data/postgres";

export class ReportesDatasourceImpl implements ReportesDatasource {

    async getUtilidadDiaria(fechaInicio: Date, fechaFin: Date): Promise<UtilidadDiariaEntity> {
        // 1. Ingresos (Ventas)
        const ventas = await prisma.ventas.aggregate({
            _sum: { total: true },
            where: {
                estado: true,
                fecha: { gte: fechaInicio, lte: fechaFin }
            }
        });
        const ingresos = Number(ventas._sum.total || 0);

        // 2. Costo de Ventas
        const ventaproductos = await prisma.ventaproductos.findMany({
            where: {
                ventas: {
                    estado: true,
                    fecha: { gte: fechaInicio, lte: fechaFin }
                }
            },
            include: {
                productos: true
            }
        });

        const costoVentas = ventaproductos.reduce((sum, item) => {
            return sum + (Number(item.cantidad) * Number(item.productos.preciocompra));
        }, 0);

        // 3. Gastos (Pagos realizados por gastos operativos, excluyendo compras/cuentas por pagar y retiros de efectivo)
        const pagos = await prisma.pagos.aggregate({
            _sum: { monto: true },
            where: {
                fecha: { gte: fechaInicio, lte: fechaFin },
                pagocuentasporpagar: {
                    none: {}
                },
                pagogastos: {
                    none: {
                        gastos: {
                            nombre: {
                                equals: 'Retiros de Efectivo',
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            }
        });
        const gastos = Number(pagos?._sum?.monto || 0);

        const utilidadNeta = ingresos - costoVentas - gastos;

        return UtilidadDiariaEntity.fromObject({
            ingresos,
            costoVentas,
            gastos,
            utilidadNeta,
            fechaInicio,
            fechaFin
        });
    }


    async getUtilidadProducto(fechaInicio: Date, fechaFin: Date): Promise<UtilidadProductoEntity[]> {
        const query = `
            SELECT 
                p.productoid, 
                p.codigobarra, 
                p.nombre, 
                c.nombre as categoria, 
                SUM(vp.cantidad) as "cantidadVendida", 
                SUM(vp.totalproducto) as "totalGenerado",
                SUM(vp.cantidad * p.preciocompra) as "totalCosto",
                SUM(vp.totalproducto - (vp.cantidad * p.preciocompra)) as "utilidad"
            FROM ventaproductos vp
            JOIN productos p ON p.productoid = vp.productoid
            LEFT JOIN categoriasproductos c ON c.categoriaid = p.categoriaid
            JOIN ventas v ON v.ventaid = vp.ventaid
            WHERE v.estado = true
              AND v.fecha >= $1
              AND v.fecha <= $2
            GROUP BY p.productoid, p.codigobarra, p.nombre, c.nombre
            ORDER BY "utilidad" DESC
        `;

        const results: any[] = await prisma.$queryRawUnsafe(query, fechaInicio, fechaFin);

        return results.map(row => {
            const totalGenerado = Number(row.totalGenerado);
            const utilidad = Number(row.utilidad);
            const margen = totalGenerado > 0 ? (utilidad / totalGenerado) * 100 : 0;
            return UtilidadProductoEntity.fromObject({
                productoid: row.productoid,
                codigobarra: row.codigobarra,
                nombre: row.nombre,
                categoria: row.categoria,
                cantidadVendida: Number(row.cantidadVendida),
                totalGenerado,
                totalCosto: Number(row.totalCosto),
                utilidad,
                margen
            });
        });
    }
}
