import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    OpenSesionDto,
    CloseSesionDto,
    SesionDatasource,
    SesionEntity,
} from "../../domain";
import prisma from "../../data/postgres";


export class SesionDatasourceImpl implements SesionDatasource {

    async open(dto: OpenSesionDto): Promise<SesionEntity> {
        // Validar que el usuario no tenga una sesión activa
        const activeSesion = await prisma.sesiones.findFirst({
            where: {
                usuarioid: dto.usuarioid,
                fechafin: null,
            },
        });

        if (activeSesion) throw 'El usuario ya tiene una sesion activa. Debe cerrarla antes de abrir una nueva.';

        const sesion = await prisma.sesiones.create({
            data: {
                usuarioid: dto.usuarioid,
                montoinicial: dto.montoinicial,
                fechainicio: new Date(),
            },
            include: {
                usuarios: true,
            },
        });

        return SesionEntity.fromObject(sesion);
    }

    async close(dto: CloseSesionDto): Promise<SesionEntity> {
        // Buscar la sesión
        const sesion = await prisma.sesiones.findFirst({
            where: { sesionid: dto.id },
        });

        if (!sesion) throw 'Sesion no encontrada';
        if (sesion.fechafin != null) throw 'La sesion ya fue cerrada';

        const fechafin = new Date();

        // Calcular montoFinalSistema = montoInicial + SUM(ventas) - SUM(compras) + SUM(abonos) - SUM(pagos) de esta sesión
        const ventasAggregate = await prisma.ventas.aggregate({
            where: {
                sesionid: dto.id,
                estado: true,
            },
            _sum: {
                total: true,
            },
        });

        const sumaVentas = Number(ventasAggregate._sum?.total || 0);

        const comprasAggregate = await prisma.compras.aggregate({
            where: {
                estado: true,
                tipocompra: { equals: 'CONTADO', mode: 'insensitive' },
                metodopago: { equals: 'efectivo', mode: 'insensitive' },
                fecha: {
                    gte: sesion.fechainicio || fechafin,
                    lte: fechafin,
                }
            },
            _sum: {
                total: true,
            }
        });
        const sumaCompras = Number(comprasAggregate._sum?.total || 0);

        const abonosAggregate = await prisma.abonos.aggregate({
            where: {
                fecha: {
                    gte: sesion.fechainicio || fechafin,
                    lte: fechafin,
                }
            },
            _sum: {
                monto: true,
            }
        });
        const sumaAbonos = Number(abonosAggregate._sum?.monto || 0);

        const pagosAggregate = await prisma.pagos.aggregate({
            where: {
                fecha: {
                    gte: sesion.fechainicio || fechafin,
                    lte: fechafin,
                }
            },
            _sum: {
                monto: true,
            }
        });
        const sumaPagos = Number(pagosAggregate._sum?.monto || 0);

        const montoFinalSistema = Number(sesion.montoinicial) + sumaVentas - sumaCompras + sumaAbonos - sumaPagos;

        const updatedSesion = await prisma.sesiones.update({
            where: { sesionid: dto.id },
            data: {
                fechafin: fechafin,
                montofinalsistema: montoFinalSistema,
                montofinalfisico: dto.montofinalfisico,
            },
            include: {
                usuarios: true,
            },
        });

        return SesionEntity.fromObject(updatedSesion);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<SesionEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            include: {
                usuarios: true,
            },
            orderBy: {
                fechainicio: 'desc',
            },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, sesiones] = await Promise.all([
            prisma.sesiones.count(),
            prisma.sesiones.findMany(findOptions),
        ]);

        return {
            data: sesiones.map((item) => SesionEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getById(id: number): Promise<SesionEntity | null> {
        const sesion = await prisma.sesiones.findFirst({
            where: { sesionid: id },
            include: {
                usuarios: true,
            },
        });

        if (!sesion) throw 'Sesion no encontrada';

        return SesionEntity.fromObject(sesion);
    }

    async getActive(usuarioid: number): Promise<SesionEntity | null> {
        const sesion = await prisma.sesiones.findFirst({
            where: {
                usuarioid: usuarioid,
                fechafin: null,
            },
            include: {
                usuarios: true,
            },
        });

        if (!sesion) return null;

        const now = new Date();

        // Calcular dinámicamente el montofinalsistema esperado
        const ventasAggregate = await prisma.ventas.aggregate({
            where: {
                sesionid: sesion.sesionid,
                estado: true,
            },
            _sum: {
                total: true,
            },
        });

        const sumaVentas = Number(ventasAggregate._sum?.total || 0);

        const comprasAggregate = await prisma.compras.aggregate({
            where: {
                estado: true,
                tipocompra: { equals: 'CONTADO', mode: 'insensitive' },
                metodopago: { equals: 'efectivo', mode: 'insensitive' },
                fecha: {
                    gte: sesion.fechainicio || now,
                    lte: now,
                }
            },
            _sum: {
                total: true,
            }
        });
        const sumaCompras = Number(comprasAggregate._sum?.total || 0);

        const abonosAggregate = await prisma.abonos.aggregate({
            where: {
                fecha: {
                    gte: sesion.fechainicio || now,
                    lte: now,
                }
            },
            _sum: {
                monto: true,
            }
        });
        const sumaAbonos = Number(abonosAggregate._sum?.monto || 0);

        const pagosAggregate = await prisma.pagos.aggregate({
            where: {
                fecha: {
                    gte: sesion.fechainicio || now,
                    lte: now,
                }
            },
            _sum: {
                monto: true,
            }
        });
        const sumaPagos = Number(pagosAggregate._sum?.monto || 0);

        const montoFinalSistema = Number(sesion.montoinicial) + sumaVentas - sumaCompras + sumaAbonos - sumaPagos;
        const sesionConTotal = { ...sesion, montofinalsistema: montoFinalSistema };

        return SesionEntity.fromObject(sesionConTotal);
    }

    async getReporteCierre(id: number): Promise<any> {
        const sesion = await prisma.sesiones.findFirst({
            where: { sesionid: id },
            include: { usuarios: true },
        });

        if (!sesion) throw 'Sesion no encontrada';
        if (sesion.fechafin != null) throw 'La sesion ya fue cerrada';

        const now = new Date();

        // Ventas en efectivo de esta sesión
        const ventas = await prisma.ventas.findMany({
            where: {
                sesionid: id,
                estado: true,
            },
            select: { ventaid: true, total: true },
            orderBy: { fecha: 'asc' },
        });

        // Compras en efectivo al contado en el rango de la sesión
        const compras = await prisma.compras.findMany({
            where: {
                estado: true,
                tipocompra: { equals: 'CONTADO', mode: 'insensitive' },
                metodopago: { equals: 'efectivo', mode: 'insensitive' },
                fecha: {
                    gte: sesion.fechainicio || now,
                    lte: now,
                },
            },
            select: { compraid: true, total: true },
            orderBy: { fecha: 'asc' },
        });

        // Abonos en efectivo en el rango
        const abonos = await prisma.abonos.findMany({
            where: {
                fecha: {
                    gte: sesion.fechainicio || now,
                    lte: now,
                },
            },
            select: { abonoid: true, monto: true },
            orderBy: { fecha: 'asc' },
        });

        // Pagos en efectivo en el rango
        const pagos = await prisma.pagos.findMany({
            where: {
                fecha: {
                    gte: sesion.fechainicio || now,
                    lte: now,
                },
            },
            select: { pagoid: true, monto: true },
            orderBy: { fecha: 'asc' },
        });

        const sumaVentas = ventas.reduce((s, v) => s + Number(v.total), 0);
        const sumaAbonos = abonos.reduce((s, a) => s + Number(a.monto), 0);
        const sumaCompras = compras.reduce((s, c) => s + Number(c.total), 0);
        const sumaPagos = pagos.reduce((s, p) => s + Number(p.monto), 0);

        const totalEntradas = sumaVentas + sumaAbonos;
        const totalSalidas = sumaCompras + sumaPagos;
        const montoInicial = Number(sesion.montoinicial);
        const totalEsperado = montoInicial + totalEntradas - totalSalidas;

        return {
            sesionid: sesion.sesionid,
            nombreusuario: (sesion as any).usuarios?.nombreusuario || '',
            fechainicio: sesion.fechainicio,
            montoinicial: montoInicial,
            entradas: {
                ventas: ventas.map(v => ({ id: v.ventaid, total: Number(v.total) })),
                abonos: abonos.map(a => ({ id: a.abonoid, total: Number(a.monto) })),
                totalVentas: sumaVentas,
                totalAbonos: sumaAbonos,
                total: totalEntradas,
            },
            salidas: {
                compras: compras.map(c => ({ id: c.compraid, total: Number(c.total) })),
                pagos: pagos.map(p => ({ id: p.pagoid, total: Number(p.monto) })),
                totalCompras: sumaCompras,
                totalPagos: sumaPagos,
                total: totalSalidas,
            },
            totalEsperado,
        };
    }
}
