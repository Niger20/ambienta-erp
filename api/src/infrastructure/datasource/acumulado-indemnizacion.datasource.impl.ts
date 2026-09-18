import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateAcumuladoIndemnizacionDto } from "../../domain/dtos/acumulado-indemnizacion/create-acumulado-indemnizacion.dto";
import { UpdateAcumuladoIndemnizacionDto } from "../../domain/dtos/acumulado-indemnizacion/update-acumulado-indemnizacion.dto";
import { AcumuladoIndemnizacionDatasource } from "../../domain/datasources/acumulado-indemnizacion.datasource";
import { AcumuladoIndemnizacionEntity } from "../../domain/entitites/acumulado-indemnizacion.entity";
import prisma from "../../data/postgres";

export class AcumuladoIndemnizacionDatasourceImpl implements AcumuladoIndemnizacionDatasource {

    async create(dto: CreateAcumuladoIndemnizacionDto): Promise<AcumuladoIndemnizacionEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        const periodo = await prisma.periodosplanilla.findUnique({
            where: { periodoid: dto.periodoid }
        });
        if (!periodo) throw 'El período especificado no existe';

        const record = await prisma.acumuladoindemnizacion.create({
            data: {
                empleadoid: dto.empleadoid,
                periodoid: dto.periodoid,
                salariobruto: dto.salariobruto,
                montoacumulado: dto.montoacumulado,
                fechageneracion: dto.fechageneracion ?? new Date(),
            },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AcumuladoIndemnizacionEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoIndemnizacionEntity>> {
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
            orderBy: [{ periodoid: 'desc' }, { acumuladoindemnid: 'desc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.acumuladoindemnizacion.count({ where }),
            prisma.acumuladoindemnizacion.findMany(findOptions),
        ]);

        return {
            data: records.map(r => AcumuladoIndemnizacionEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<AcumuladoIndemnizacionEntity | null> {
        const record = await prisma.acumuladoindemnizacion.findFirst({
            where: { acumuladoindemnid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        if (!record) throw 'Registro de acumulado de indemnización no encontrado';
        return AcumuladoIndemnizacionEntity.fromObject(record);
    }

    async update(dto: UpdateAcumuladoIndemnizacionDto): Promise<AcumuladoIndemnizacionEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.acumuladoindemnizacion.update({
            where: { acumuladoindemnid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AcumuladoIndemnizacionEntity.fromObject(updated);
    }

    async delete(id: number): Promise<AcumuladoIndemnizacionEntity> {
        await this.getById(id);
        const deleted = await prisma.acumuladoindemnizacion.delete({
            where: { acumuladoindemnid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AcumuladoIndemnizacionEntity.fromObject(deleted);
    }
}
