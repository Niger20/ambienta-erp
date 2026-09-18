import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateSolicitudVacacionesDto } from "../../domain/dtos/solicitud-vacaciones/create-solicitud-vacaciones.dto";
import { UpdateSolicitudVacacionesDto } from "../../domain/dtos/solicitud-vacaciones/update-solicitud-vacaciones.dto";
import { SolicitudVacacionesDatasource } from "../../domain/datasources/solicitud-vacaciones.datasource";
import { SolicitudVacacionesEntity } from "../../domain/entitites/solicitud-vacaciones.entity";
import prisma from "../../data/postgres";

export class SolicitudVacacionesDatasourceImpl implements SolicitudVacacionesDatasource {

    async create(dto: CreateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        const record = await prisma.solicitudesvacaciones.create({
            data: {
                empleadoid: dto.empleadoid,
                fechainicio: dto.fechainicio,
                fechafin: dto.fechafin,
                diashabiles: dto.diashabiles,
                estado: dto.estado,
                observaciones: dto.observaciones,
            },
            include: {
                empleados: true,
            }
        });
        return SolicitudVacacionesEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<SolicitudVacacionesEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (empleadoid) where.empleadoid = empleadoid;
        if (estado) where.estado = { equals: estado, mode: 'insensitive' };

        const findOptions: any = {
            where,
            include: {
                empleados: true,
            },
            orderBy: [{ fechainicio: 'desc' }, { solicitudvacid: 'desc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.solicitudesvacaciones.count({ where }),
            prisma.solicitudesvacaciones.findMany(findOptions),
        ]);

        return {
            data: records.map(r => SolicitudVacacionesEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<SolicitudVacacionesEntity | null> {
        const record = await prisma.solicitudesvacaciones.findFirst({
            where: { solicitudvacid: id },
            include: {
                empleados: true,
            }
        });
        if (!record) throw 'Solicitud de vacaciones no encontrada';
        return SolicitudVacacionesEntity.fromObject(record);
    }

    async update(dto: UpdateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.solicitudesvacaciones.update({
            where: { solicitudvacid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
            }
        });
        return SolicitudVacacionesEntity.fromObject(updated);
    }

    async delete(id: number): Promise<SolicitudVacacionesEntity> {
        await this.getById(id);
        const deleted = await prisma.solicitudesvacaciones.delete({
            where: { solicitudvacid: id },
            include: {
                empleados: true,
            }
        });
        return SolicitudVacacionesEntity.fromObject(deleted);
    }
}
