import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateAbonoDto,
    AbonoDatasource,
    AbonoEntity,
    UpdateAbonoDto,
} from "../../domain";
import prisma from "../../data/postgres";

export class AbonoDatasourceImpl implements AbonoDatasource {

    async create(dto: CreateAbonoDto): Promise<AbonoEntity> {
        const result = await prisma.$transaction(async (tx) => {
            const cuenta = await tx.cuentasporcobrar.findFirst({
                where: { cuentaid: dto.cuentaid }
            });

            if (!cuenta) throw 'Cuenta por cobrar no encontrada';

            const record = await tx.abonos.create({
                data: {
                    cuentaid: dto.cuentaid,
                    monto: dto.monto,
                    metodopago: dto.metodopago,
                    fecha: dto.fecha,
                },
            });

            await tx.cuentasporcobrar.update({
                where: { cuentaid: dto.cuentaid },
                data: {
                    montopagado: Number(cuenta.montopagado || 0) + dto.monto
                }
            });

            return record;
        });

        return AbonoEntity.fromObject(result);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<AbonoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.abonos.count(),
            prisma.abonos.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => AbonoEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getById(id: number): Promise<AbonoEntity | null> {
        const record = await prisma.abonos.findFirst({
            where: { abonoid: id },
        });

        if (!record) throw 'Abono no encontrado';
        return AbonoEntity.fromObject(record);
    }

    async getByCuentaId(cuentaid: number): Promise<AbonoEntity[]> {
        const records = await prisma.abonos.findMany({
            where: { cuentaid },
        });

        return records.map((r) => AbonoEntity.fromObject(r));
    }

    async update(dto: UpdateAbonoDto): Promise<AbonoEntity> {
        const record = await prisma.abonos.findFirst({ where: { abonoid: dto.id } });
        if (!record) throw 'Abono no encontrado';

        const result = await prisma.$transaction(async (tx) => {
            if (dto.monto !== undefined && dto.monto !== Number(record.monto)) {
                const cuenta = await tx.cuentasporcobrar.findFirst({
                    where: { cuentaid: record.cuentaid }
                });

                if (cuenta) {
                    const difference = dto.monto - Number(record.monto);
                    await tx.cuentasporcobrar.update({
                        where: { cuentaid: record.cuentaid },
                        data: {
                            montopagado: Number(cuenta.montopagado || 0) + difference
                        }
                    });
                }
            }

            const updated = await tx.abonos.update({
                where: { abonoid: dto.id },
                data: dto.values
            });

            return updated;
        });

        return AbonoEntity.fromObject(result);
    }

    async delete(id: number): Promise<AbonoEntity> {
        const record = await prisma.abonos.findFirst({ where: { abonoid: id } });
        if (!record) throw 'Abono no encontrado';

        const result = await prisma.$transaction(async (tx) => {
            const cuenta = await tx.cuentasporcobrar.findFirst({
                where: { cuentaid: record.cuentaid }
            });

            if (cuenta) {
                await tx.cuentasporcobrar.update({
                    where: { cuentaid: record.cuentaid },
                    data: {
                        montopagado: Number(cuenta.montopagado || 0) - Number(record.monto)
                    }
                });
            }

            const deleted = await tx.abonos.delete({
                where: { abonoid: id }
            });

            return deleted;
        });

        return AbonoEntity.fromObject(result);
    }
}
