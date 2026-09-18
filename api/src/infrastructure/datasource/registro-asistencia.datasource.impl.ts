import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateRegistroAsistenciaDto } from "../../domain/dtos/registro-asistencia/create-registro-asistencia.dto";
import { UpdateRegistroAsistenciaDto } from "../../domain/dtos/registro-asistencia/update-registro-asistencia.dto";
import { RegistroAsistenciaDatasource } from "../../domain/datasources/registro-asistencia.datasource";
import { RegistroAsistenciaEntity } from "../../domain/entitites/registro-asistencia.entity";
import prisma from "../../data/postgres";

export class RegistroAsistenciaDatasourceImpl implements RegistroAsistenciaDatasource {

    async create(dto: CreateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        const record = await prisma.registroasistencia.create({
            data: {
                empleadoid: dto.empleadoid,
                fecha: dto.fecha,
                horaentrada: dto.horaentrada,
                horasalida: dto.horasalida,
                horastrabajadas: dto.horastrabajadas,
                horasextra: dto.horasextra,
                tipoausencia: dto.tipoausencia,
                observaciones: dto.observaciones,
            },
            include: {
                empleados: true,
            }
        });
        return RegistroAsistenciaEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number, fecha?: Date): Promise<PaginatedResult<RegistroAsistenciaEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (empleadoid) where.empleadoid = empleadoid;
        if (fecha) where.fecha = fecha;

        const findOptions: any = {
            where,
            include: {
                empleados: true,
            },
            orderBy: [{ fecha: 'desc' }, { asistenciaid: 'desc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.registroasistencia.count({ where }),
            prisma.registroasistencia.findMany(findOptions),
        ]);

        return {
            data: records.map(r => RegistroAsistenciaEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<RegistroAsistenciaEntity | null> {
        const record = await prisma.registroasistencia.findFirst({
            where: { asistenciaid: id },
            include: {
                empleados: true,
            }
        });
        if (!record) throw 'Registro de asistencia no encontrado';
        return RegistroAsistenciaEntity.fromObject(record);
    }

    async update(dto: UpdateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.registroasistencia.update({
            where: { asistenciaid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
            }
        });
        return RegistroAsistenciaEntity.fromObject(updated);
    }

    async delete(id: number): Promise<RegistroAsistenciaEntity> {
        await this.getById(id);
        const deleted = await prisma.registroasistencia.delete({
            where: { asistenciaid: id },
            include: {
                empleados: true,
            }
        });
        return RegistroAsistenciaEntity.fromObject(deleted);
    }
}
