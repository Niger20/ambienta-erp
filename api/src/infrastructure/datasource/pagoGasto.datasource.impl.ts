import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreatePagoGastoDto,
    PagoGastoDatasource,
    PagoGastoEntity,
} from "../../domain";
import prisma from "../../data/postgres";


export class PagoGastoDatasourceImpl implements PagoGastoDatasource {

    async create(dto: CreatePagoGastoDto): Promise<PagoGastoEntity> {
        const record = await prisma.pagogastos.create({
            data: {
                pagoid: dto.pagoid,
                gastoid: dto.gastoid,
            },
        });

        return PagoGastoEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<PagoGastoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            include: { pagos: true },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.pagogastos.count(),
            prisma.pagogastos.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => PagoGastoEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getByPagoId(pagoid: number): Promise<PagoGastoEntity[]> {
        const records = await prisma.pagogastos.findMany({
            where: { pagoid },
            include: { pagos: true },
        });
        return records.map((r) => PagoGastoEntity.fromObject(r));
    }

    async getByGastoId(gastoid: number): Promise<PagoGastoEntity[]> {
        const records = await prisma.pagogastos.findMany({
            where: { gastoid },
            include: { pagos: true },
        });
        return records.map((r) => PagoGastoEntity.fromObject(r));
    }

    async delete(pagoid: number, gastoid: number): Promise<PagoGastoEntity> {
        const record = await prisma.pagogastos.delete({
            where: {
                pagoid_gastoid: { pagoid, gastoid },
            },
        });

        return PagoGastoEntity.fromObject(record);
    }
}
