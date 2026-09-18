import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePeriodoPlanillaDto } from "../../domain/dtos/periodo-planilla/create-periodo-planilla.dto";
import { UpdatePeriodoPlanillaDto } from "../../domain/dtos/periodo-planilla/update-periodo-planilla.dto";
import { PeriodoPlanillaDatasource } from "../../domain/datasources/periodo-planilla.datasource";
import { PeriodoPlanillaEntity } from "../../domain/entitites/periodo-planilla.entity";
import prisma from "../../data/postgres";

export class PeriodoPlanillaDatasourceImpl implements PeriodoPlanillaDatasource {

    async create(dto: CreatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity> {
        const record = await prisma.periodosplanilla.create({
            data: {
                tipoperiodo: dto.tipoperiodo,
                fechainicio: dto.fechainicio,
                fechafin: dto.fechafin,
                fechapago: dto.fechapago,
                estado: dto.estado,
                observaciones: dto.observaciones,
            }
        });
        return PeriodoPlanillaEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, estado?: string): Promise<PaginatedResult<PeriodoPlanillaEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (estado) where.estado = { equals: estado, mode: 'insensitive' };

        const findOptions: any = {
            where,
            orderBy: [{ fechainicio: 'desc' }, { periodoid: 'desc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.periodosplanilla.count({ where }),
            prisma.periodosplanilla.findMany(findOptions),
        ]);

        return {
            data: records.map(r => PeriodoPlanillaEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<PeriodoPlanillaEntity | null> {
        const record = await prisma.periodosplanilla.findFirst({
            where: { periodoid: id },
            include: {
                planilladetalle: {
                    include: {
                        empleados: true
                    }
                }
            }
        });
        if (!record) throw 'Período de planilla no encontrado';
        return PeriodoPlanillaEntity.fromObject(record);
    }

    async update(dto: UpdatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.periodosplanilla.update({
            where: { periodoid: dto.id },
            data: dto.values,
        });
        return PeriodoPlanillaEntity.fromObject(updated);
    }

    async delete(id: number): Promise<PeriodoPlanillaEntity> {
        await this.getById(id);
        const deleted = await prisma.periodosplanilla.delete({
            where: { periodoid: id }
        });
        return PeriodoPlanillaEntity.fromObject(deleted);
    }
}
