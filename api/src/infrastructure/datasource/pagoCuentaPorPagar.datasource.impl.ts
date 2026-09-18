import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreatePagoCuentaPorPagarDto,
    PagoCuentaPorPagarDatasource,
    PagoCuentaPorPagarEntity,
} from "../../domain";
import prisma from "../../data/postgres";

export class PagoCuentaPorPagarDatasourceImpl implements PagoCuentaPorPagarDatasource {

    async create(dto: CreatePagoCuentaPorPagarDto): Promise<PagoCuentaPorPagarEntity> {
        const record = await prisma.pagocuentasporpagar.create({
            data: {
                pagoid: dto.pagoid,
                cuentapagarid: dto.cuentapagarid,
            },
        });

        const [pago, cuenta] = await Promise.all([
            prisma.pagos.findUnique({ where: { pagoid: dto.pagoid } }),
            prisma.cuentasporpagar.findUnique({ where: { cuentapagarid: dto.cuentapagarid } }),
        ]);

        if (pago && cuenta) {
            const nuevoMontopagado = Number(cuenta.montopagado || 0) + Number(pago.monto || 0);
            const nuevoRestante = Number(cuenta.montototal) - nuevoMontopagado;
            await prisma.cuentasporpagar.update({
                where: { cuentapagarid: dto.cuentapagarid },
                data: {
                    montopagado: nuevoMontopagado,
                    estado: nuevoRestante <= 0 ? 'PAGADO' : 'PENDIENTE',
                },
            });
        }

        return PagoCuentaPorPagarEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<PagoCuentaPorPagarEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.pagocuentasporpagar.count(),
            prisma.pagocuentasporpagar.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => PagoCuentaPorPagarEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getByPagoId(pagoid: number): Promise<PagoCuentaPorPagarEntity[]> {
        const records = await prisma.pagocuentasporpagar.findMany({
            where: { pagoid },
        });
        return records.map((r) => PagoCuentaPorPagarEntity.fromObject(r));
    }

    async getByCuentaPagarId(cuentapagarid: number): Promise<PagoCuentaPorPagarEntity[]> {
        const records = await prisma.pagocuentasporpagar.findMany({
            where: { cuentapagarid },
        });
        return records.map((r) => PagoCuentaPorPagarEntity.fromObject(r));
    }

    async delete(pagoid: number, cuentapagarid: number): Promise<PagoCuentaPorPagarEntity> {
        const pago = await prisma.pagos.findUnique({ where: { pagoid } });
        const record = await prisma.pagocuentasporpagar.delete({
            where: {
                pagoid_cuentapagarid: { pagoid, cuentapagarid },
            },
        });

        const cuenta = await prisma.cuentasporpagar.findUnique({ where: { cuentapagarid } });
        if (pago && cuenta) {
            const nuevoMontopagado = Math.max(0, Number(cuenta.montopagado || 0) - Number(pago.monto || 0));
            const nuevoRestante = Number(cuenta.montototal) - nuevoMontopagado;
            await prisma.cuentasporpagar.update({
                where: { cuentapagarid },
                data: {
                    montopagado: nuevoMontopagado,
                    estado: nuevoRestante <= 0 ? 'PAGADO' : 'PENDIENTE',
                },
            });
        }

        return PagoCuentaPorPagarEntity.fromObject(record);
    }
}
