import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateTablaTramoIrDto } from "../../domain/dtos/tabla-tramo-ir/create-tabla-tramo-ir.dto";
import { UpdateTablaTramoIrDto } from "../../domain/dtos/tabla-tramo-ir/update-tabla-tramo-ir.dto";
import { TablaTramoIrDatasource } from "../../domain/datasources/tabla-tramo-ir.datasource";
import { TablaTramoIrEntity } from "../../domain/entitites/tabla-tramo-ir.entity";
import prisma from "../../data/postgres";

export class TablaTramoIrDatasourceImpl implements TablaTramoIrDatasource {

    async create(dto: CreateTablaTramoIrDto): Promise<TablaTramoIrEntity> {
        const record = await prisma.tablatramoir.create({
            data: {
                salariodesde: dto.salariodesde,
                salariohasta: dto.salariohasta,
                cuotafija: dto.cuotafija,
                tasamarginal: dto.tasamarginal,
                fechavigencia: dto.fechavigencia,
                activo: dto.activo,
            }
        });
        return TablaTramoIrEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<TablaTramoIrEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (activo !== undefined) where.activo = activo;

        const findOptions: any = {
            where,
            orderBy: { salariodesde: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.tablatramoir.count({ where }),
            prisma.tablatramoir.findMany(findOptions),
        ]);

        return {
            data: records.map(r => TablaTramoIrEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<TablaTramoIrEntity | null> {
        const record = await prisma.tablatramoir.findFirst({
            where: { tramoirid: id }
        });
        if (!record) throw 'Tramo de IR no encontrado';
        return TablaTramoIrEntity.fromObject(record);
    }

    async update(dto: UpdateTablaTramoIrDto): Promise<TablaTramoIrEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.tablatramoir.update({
            where: { tramoirid: dto.id },
            data: dto.values,
        });
        return TablaTramoIrEntity.fromObject(updated);
    }

    async delete(id: number): Promise<TablaTramoIrEntity> {
        await this.getById(id);
        const deleted = await prisma.tablatramoir.update({
            where: { tramoirid: id },
            data: { activo: false }
        });
        return TablaTramoIrEntity.fromObject(deleted);
    }
}
