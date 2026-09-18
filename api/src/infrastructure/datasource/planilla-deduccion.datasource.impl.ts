import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePlanillaDeduccionDto } from "../../domain/dtos/planilla-deduccion/create-planilla-deduccion.dto";
import { UpdatePlanillaDeduccionDto } from "../../domain/dtos/planilla-deduccion/update-planilla-deduccion.dto";
import { PlanillaDeduccionDatasource } from "../../domain/datasources/planilla-deduccion.datasource";
import { PlanillaDeduccionEntity } from "../../domain/entitites/planilla-deduccion.entity";
import prisma from "../../data/postgres";

export class PlanillaDeduccionDatasourceImpl implements PlanillaDeduccionDatasource {

    async create(dto: CreatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity> {
        const detalle = await prisma.planilladetalle.findUnique({
            where: { detalleid: dto.detalleid }
        });
        if (!detalle) throw 'El detalle de planilla especificado no existe';

        const record = await prisma.planilladeducciones.create({
            data: {
                detalleid: dto.detalleid,
                concepto: dto.concepto,
                monto: dto.monto,
            }
        });
        return PlanillaDeduccionEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, detalleid?: number): Promise<PaginatedResult<PlanillaDeduccionEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (detalleid) where.detalleid = detalleid;

        const findOptions: any = {
            where,
            orderBy: { deduccionplanillaid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.planilladeducciones.count({ where }),
            prisma.planilladeducciones.findMany(findOptions),
        ]);

        return {
            data: records.map(r => PlanillaDeduccionEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<PlanillaDeduccionEntity | null> {
        const record = await prisma.planilladeducciones.findFirst({
            where: { deduccionplanillaid: id }
        });
        if (!record) throw 'Deducción de planilla no encontrada';
        return PlanillaDeduccionEntity.fromObject(record);
    }

    async update(dto: UpdatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.planilladeducciones.update({
            where: { deduccionplanillaid: dto.id },
            data: dto.values,
        });
        return PlanillaDeduccionEntity.fromObject(updated);
    }

    async delete(id: number): Promise<PlanillaDeduccionEntity> {
        await this.getById(id);
        const deleted = await prisma.planilladeducciones.delete({
            where: { deduccionplanillaid: id }
        });
        return PlanillaDeduccionEntity.fromObject(deleted);
    }
}
