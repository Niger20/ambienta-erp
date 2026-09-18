import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateAcumuladoDecimoPrimerMesDto } from "../../domain/dtos/acumulado-decimo-primer-mes/create-acumulado-decimo-primer-mes.dto";
import { UpdateAcumuladoDecimoPrimerMesDto } from "../../domain/dtos/acumulado-decimo-primer-mes/update-acumulado-decimo-primer-mes.dto";
import { AcumuladoDecimoPrimerMesDatasource } from "../../domain/datasources/acumulado-decimo-primer-mes.datasource";
import { AcumuladoDecimoPrimerMesEntity } from "../../domain/entitites/acumulado-decimo-primer-mes.entity";
import prisma from "../../data/postgres";

export class AcumuladoDecimoPrimerMesDatasourceImpl implements AcumuladoDecimoPrimerMesDatasource {

    async create(dto: CreateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        const periodo = await prisma.periodosplanilla.findUnique({
            where: { periodoid: dto.periodoid }
        });
        if (!periodo) throw 'El período especificado no existe';

        const record = await prisma.acumuladodecimoprimermes.create({
            data: {
                empleadoid: dto.empleadoid,
                periodoid: dto.periodoid,
                salariobruto: dto.salariobruto,
                montoacumulado: dto.montoacumulado,
                montopagado: dto.montopagado,
                fechageneracion: dto.fechageneracion ?? new Date(),
            },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AcumuladoDecimoPrimerMesEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoDecimoPrimerMesEntity>> {
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
            orderBy: [{ periodoid: 'desc' }, { acumuladodecimoid: 'desc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.acumuladodecimoprimermes.count({ where }),
            prisma.acumuladodecimoprimermes.findMany(findOptions),
        ]);

        return {
            data: records.map(r => AcumuladoDecimoPrimerMesEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<AcumuladoDecimoPrimerMesEntity | null> {
        const record = await prisma.acumuladodecimoprimermes.findFirst({
            where: { acumuladodecimoid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        if (!record) throw 'Registro de acumulado décimo primer mes no encontrado';
        return AcumuladoDecimoPrimerMesEntity.fromObject(record);
    }

    async update(dto: UpdateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.acumuladodecimoprimermes.update({
            where: { acumuladodecimoid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AcumuladoDecimoPrimerMesEntity.fromObject(updated);
    }

    async delete(id: number): Promise<AcumuladoDecimoPrimerMesEntity> {
        await this.getById(id);
        const deleted = await prisma.acumuladodecimoprimermes.delete({
            where: { acumuladodecimoid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AcumuladoDecimoPrimerMesEntity.fromObject(deleted);
    }
}
