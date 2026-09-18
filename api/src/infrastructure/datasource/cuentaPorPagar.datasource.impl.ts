import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateCuentaPorPagarDto,
    CuentaPorPagarDatasource,
    CuentaPorPagarEntity,
    UpdateCuentaPorPagarDto,
} from "../../domain";
import prisma from "../../data/postgres";

export class CuentaPorPagarDatasourceImpl implements CuentaPorPagarDatasource {

    async create(dto: CreateCuentaPorPagarDto): Promise<CuentaPorPagarEntity> {
        const compra = await prisma.compras.findFirst({
            where: { compraid: dto.compraid },
        });

        if (!compra) throw 'Compra no encontrada';

        const montototal = Number(compra.total);
        let montocuota: number | null = null;
        if (dto.cuotas && dto.cuotas > 0) {
            montocuota = montototal / dto.cuotas;
        }

        const record = await prisma.cuentasporpagar.create({
            data: {
                compraid: dto.compraid,
                montototal: montototal,
                montopagado: 0,
                // montorestante was set to dbgenerated, so we don't explicitly write it unless needed, it might be auto-calculated though it's often safer to rely on db triggers or just set it
                cuotas: dto.cuotas,
                montocuota: montocuota,
                fechacuota: dto.fechacuota,
                fechavencimiento: dto.fechavencimiento,
                estado: dto.estado,
            },
        });

        return CuentaPorPagarEntity.fromObject(record);
    }

    private formatRecord(item: any): CuentaPorPagarEntity {
        const sumPagos = item.pagocuentasporpagar
            ? item.pagocuentasporpagar.reduce((sum: number, p: any) => sum + (p.pagos && p.pagos.estado !== false ? Number(p.pagos.monto || 0) : 0), 0)
            : 0;

        const montopagado = Math.max(Number(item.montopagado || 0), sumPagos);
        const montorestante = Math.max(0, Number(item.montototal) - montopagado);
        const estado = item.estado === 'ANULADA' ? 'ANULADA' : (montorestante <= 0 ? 'PAGADO' : (item.estado || 'PENDIENTE'));

        return CuentaPorPagarEntity.fromObject({
            ...item,
            montopagado,
            montorestante,
            estado,
        });
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<CuentaPorPagarEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            where: { estado: { not: 'ANULADA' } },
            include: { compras: { include: { proveedores: true } }, pagocuentasporpagar: { include: { pagos: true } } },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.cuentasporpagar.count({ where: { estado: { not: 'ANULADA' } } }),
            prisma.cuentasporpagar.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => this.formatRecord(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getDeactivated(): Promise<CuentaPorPagarEntity[]> {
        const records = await prisma.cuentasporpagar.findMany({
            where: { estado: 'ANULADA' },
            include: { compras: { include: { proveedores: true } }, pagocuentasporpagar: { include: { pagos: true } } },
        });
        return records.map((r) => this.formatRecord(r));
    }

    async getById(id: number): Promise<CuentaPorPagarEntity | null> {
        const record = await prisma.cuentasporpagar.findFirst({
            where: { cuentapagarid: id },
            include: { compras: { include: { proveedores: true } }, pagocuentasporpagar: { include: { pagos: true } } },
        });

        if (!record) throw 'Cuenta por pagar no encontrada';

        return this.formatRecord(record);
    }

    async update(dto: UpdateCuentaPorPagarDto): Promise<CuentaPorPagarEntity> {
        await this.getById(dto.id);
        const existingRecord = await prisma.cuentasporpagar.findUnique({ where: { cuentapagarid: dto.id } });

        let resultMontocuota: number | null = existingRecord ? Number(existingRecord.montocuota) : null;
        if (dto.cuotas !== undefined && dto.cuotas !== null && dto.cuotas > 0) {
            if (existingRecord) {
                resultMontocuota = Number(existingRecord.montototal) / dto.cuotas;
            }
        } else if (dto.cuotas === null) {
            resultMontocuota = null;
        }

        await prisma.cuentasporpagar.update({
            where: { cuentapagarid: dto.id },
            data: {
                ...dto.values,
                montocuota: resultMontocuota,
            }
        });

        const updated = await this.getById(dto.id);
        return updated!;
    }

    async delete(id: number): Promise<CuentaPorPagarEntity> {
        await this.getById(id);

        const record = await prisma.cuentasporpagar.update({
            where: { cuentapagarid: id },
            data: { estado: 'ANULADA' }
        });

        return CuentaPorPagarEntity.fromObject(record);
    }
}
