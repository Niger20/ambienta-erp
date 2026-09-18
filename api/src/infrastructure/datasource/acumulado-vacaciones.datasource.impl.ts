import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateAcumuladoVacacionesDto } from "../../domain/dtos/acumulado-vacaciones/create-acumulado-vacaciones.dto";
import { UpdateAcumuladoVacacionesDto } from "../../domain/dtos/acumulado-vacaciones/update-acumulado-vacaciones.dto";
import { AcumuladoVacacionesDatasource } from "../../domain/datasources/acumulado-vacaciones.datasource";
import { AcumuladoVacacionesEntity } from "../../domain/entitites/acumulado-vacaciones.entity";
import prisma from "../../data/postgres";

export class AcumuladoVacacionesDatasourceImpl implements AcumuladoVacacionesDatasource {

    async create(dto: CreateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        const periodo = await prisma.periodosplanilla.findUnique({
            where: { periodoid: dto.periodoid }
        });
        if (!periodo) throw 'El período especificado no existe';

        const record = await prisma.acumuladovacaciones.create({
            data: {
                empleadoid: dto.empleadoid,
                periodoid: dto.periodoid,
                diasganados: dto.diasganados,
                valordiasalario: dto.valordiasalario,
                montoganado: dto.montoganado,
                diasdisfrutados: dto.diasdisfrutados,
                montopagado: dto.montopagado,
                fechageneracion: dto.fechageneracion ?? new Date(),
            },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AcumuladoVacacionesEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoVacacionesEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (empleadoid) where.empleadoid = empleadoid;
        if (periodoid) where.periodoid = periodoid;

        const findOptions: any = {
            where,
            include: {
                empleados: true,
                periodosplanilla: true,
            },
            orderBy: [{ periodoid: 'desc' }, { acumuladovacid: 'desc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.acumuladovacaciones.count({ where }),
            prisma.acumuladovacaciones.findMany(findOptions),
        ]);

        return {
            data: records.map(r => AcumuladoVacacionesEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<AcumuladoVacacionesEntity | null> {
        const record = await prisma.acumuladovacaciones.findFirst({
            where: { acumuladovacid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        if (!record) throw 'Registro de acumulado de vacaciones no encontrado';
        return AcumuladoVacacionesEntity.fromObject(record);
    }

    async update(dto: UpdateAcumuladoVacacionesDto): Promise<AcumuladoVacacionesEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.acumuladovacaciones.update({
            where: { acumuladovacid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AcumuladoVacacionesEntity.fromObject(updated);
    }

    async delete(id: number): Promise<AcumuladoVacacionesEntity> {
        await this.getById(id);
        const deleted = await prisma.acumuladovacaciones.delete({
            where: { acumuladovacid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AcumuladoVacacionesEntity.fromObject(deleted);
    }
}
