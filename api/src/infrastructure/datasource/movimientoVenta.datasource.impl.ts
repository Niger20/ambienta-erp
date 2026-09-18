import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateMovimientoVentaDto,
    MovimientoVentaDatasource,
    MovimientoVentaEntity,
} from "../../domain";
import prisma from "../../data/postgres";

export class MovimientoVentaDatasourceImpl implements MovimientoVentaDatasource {

    async create(dto: CreateMovimientoVentaDto): Promise<MovimientoVentaEntity> {
        const record = await prisma.movimientoventas.create({
            data: {
                movimeintoventaid: dto.movimeintoventaid,
                ventaid: dto.ventaid,
            },
        });

        return MovimientoVentaEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<MovimientoVentaEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.movimientoventas.count(),
            prisma.movimientoventas.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => MovimientoVentaEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getByMovimientoId(movimeintoventaid: number): Promise<MovimientoVentaEntity[]> {
        const records = await prisma.movimientoventas.findMany({
            where: { movimeintoventaid },
        });
        return records.map((r) => MovimientoVentaEntity.fromObject(r));
    }

    async getByVentaId(ventaid: number): Promise<MovimientoVentaEntity[]> {
        const records = await prisma.movimientoventas.findMany({
            where: { ventaid },
        });
        return records.map((r) => MovimientoVentaEntity.fromObject(r));
    }

    async delete(movimeintoventaid: number, ventaid: number): Promise<MovimientoVentaEntity> {
        const record = await prisma.movimientoventas.delete({
            where: {
                movimeintoventaid_ventaid: { movimeintoventaid, ventaid },
            },
        });

        return MovimientoVentaEntity.fromObject(record);
    }
}
