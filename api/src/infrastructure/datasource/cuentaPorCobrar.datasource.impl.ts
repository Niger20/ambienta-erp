import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateCuentaPorCobrarDto,
    CuentaPorCobrarDatasource,
    CuentaPorCobrarEntity,
    UpdateCuentaPorCobrarDto,
} from "../../domain";
import prisma from "../../data/postgres";

export class CuentaPorCobrarDatasourceImpl implements CuentaPorCobrarDatasource {

    async create(dto: CreateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity> {
        const venta = await prisma.ventas.findFirst({
            where: { ventaid: dto.ventaid },
        });

        if (!venta) throw 'Venta no encontrada';

        const montototal = Number(venta.total);

        const record = await prisma.cuentasporcobrar.create({
            data: {
                ventaid: dto.ventaid,
                clienteid: dto.clienteid,
                montototal: montototal,
                montopagado: 0,
                fechavencimiento: dto.fechavencimiento,
                estado: dto.estado,
            },
        });

        return CuentaPorCobrarEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<CuentaPorCobrarEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            where: { estado: { not: 'ANULADA' } },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.cuentasporcobrar.count({ where: { estado: { not: 'ANULADA' } } }),
            prisma.cuentasporcobrar.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => CuentaPorCobrarEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getDeactivated(): Promise<CuentaPorCobrarEntity[]> {
        const records = await prisma.cuentasporcobrar.findMany({
            where: { estado: 'ANULADA' },
        });
        return records.map((r) => CuentaPorCobrarEntity.fromObject(r));
    }

    async getById(id: number): Promise<CuentaPorCobrarEntity | null> {
        const record = await prisma.cuentasporcobrar.findFirst({
            where: { cuentaid: id },
        });

        if (!record) throw 'Cuenta por cobrar no encontrada';

        // Recalculamos el restante virtualmente porque en dbgenerated hay ocasiones donde Prisma retorna undefined hasta un refetech
        const dataConRestante = {
            ...record,
            montorestante: Number(record.montototal) - Number(record.montopagado || 0)
        };

        return CuentaPorCobrarEntity.fromObject(dataConRestante);
    }

    async update(dto: UpdateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity> {
        await this.getById(dto.id);

        const updatedRecord = await prisma.cuentasporcobrar.update({
            where: { cuentaid: dto.id },
            data: dto.values
        });

        return CuentaPorCobrarEntity.fromObject(updatedRecord);
    }

    async delete(id: number): Promise<CuentaPorCobrarEntity> {
        await this.getById(id);

        const record = await prisma.cuentasporcobrar.update({
            where: { cuentaid: id },
            data: { estado: 'ANULADA' }
        });

        return CuentaPorCobrarEntity.fromObject(record);
    }
}
