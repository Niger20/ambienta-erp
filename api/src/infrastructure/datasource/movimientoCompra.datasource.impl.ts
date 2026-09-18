import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateMovimientoCompraDto,
    MovimientoCompraDatasource,
    MovimientoCompraEntity,
} from "../../domain";
import prisma from "../../data/postgres";

export class MovimientoCompraDatasourceImpl implements MovimientoCompraDatasource {

    async create(dto: CreateMovimientoCompraDto): Promise<MovimientoCompraEntity> {
        const record = await prisma.movimientoscompras.create({
            data: {
                movimientocompraid: dto.movimientocompraid,
                compraid: dto.compraid,
            },
        });

        return MovimientoCompraEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<MovimientoCompraEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.movimientoscompras.count(),
            prisma.movimientoscompras.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => MovimientoCompraEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getByMovimientoId(movimientocompraid: number): Promise<MovimientoCompraEntity[]> {
        const records = await prisma.movimientoscompras.findMany({
            where: { movimientocompraid },
        });
        return records.map((r) => MovimientoCompraEntity.fromObject(r));
    }

    async getByCompraId(compraid: number): Promise<MovimientoCompraEntity[]> {
        const records = await prisma.movimientoscompras.findMany({
            where: { compraid },
        });
        return records.map((r) => MovimientoCompraEntity.fromObject(r));
    }

    async delete(movimientocompraid: number, compraid: number): Promise<MovimientoCompraEntity> {
        const record = await prisma.movimientoscompras.delete({
            where: {
                movimientocompraid_compraid: { movimientocompraid, compraid },
            },
        });

        return MovimientoCompraEntity.fromObject(record);
    }
}
