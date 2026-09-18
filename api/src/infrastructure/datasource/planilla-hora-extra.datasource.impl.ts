import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePlanillaHoraExtraDto } from "../../domain/dtos/planilla-hora-extra/create-planilla-hora-extra.dto";
import { UpdatePlanillaHoraExtraDto } from "../../domain/dtos/planilla-hora-extra/update-planilla-hora-extra.dto";
import { PlanillaHoraExtraDatasource } from "../../domain/datasources/planilla-hora-extra.datasource";
import { PlanillaHoraExtraEntity } from "../../domain/entitites/planilla-hora-extra.entity";
import prisma from "../../data/postgres";

export class PlanillaHoraExtraDatasourceImpl implements PlanillaHoraExtraDatasource {

    async create(dto: CreatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity> {
        const detalle = await prisma.planilladetalle.findUnique({
            where: { detalleid: dto.detalleid }
        });
        if (!detalle) throw 'El detalle de planilla especificado no existe';

        const record = await prisma.planillahorasextra.create({
            data: {
                detalleid: dto.detalleid,
                fecha: dto.fecha,
                tipohora: dto.tipohora,
                horastrabajadas: dto.horastrabajadas,
                tarifahora: dto.tarifahora,
                porcentajerecargo: dto.porcentajerecargo,
            }
        });
        return PlanillaHoraExtraEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, detalleid?: number): Promise<PaginatedResult<PlanillaHoraExtraEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (detalleid) where.detalleid = detalleid;

        const findOptions: any = {
            where,
            orderBy: { horasextraid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.planillahorasextra.count({ where }),
            prisma.planillahorasextra.findMany(findOptions),
        ]);

        return {
            data: records.map(r => PlanillaHoraExtraEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<PlanillaHoraExtraEntity | null> {
        const record = await prisma.planillahorasextra.findFirst({
            where: { horasextraid: id }
        });
        if (!record) throw 'Registro de horas extra no encontrado';
        return PlanillaHoraExtraEntity.fromObject(record);
    }

    async update(dto: UpdatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.planillahorasextra.update({
            where: { horasextraid: dto.id },
            data: dto.values,
        });
        return PlanillaHoraExtraEntity.fromObject(updated);
    }

    async delete(id: number): Promise<PlanillaHoraExtraEntity> {
        await this.getById(id);
        const deleted = await prisma.planillahorasextra.delete({
            where: { horasextraid: id }
        });
        return PlanillaHoraExtraEntity.fromObject(deleted);
    }
}
