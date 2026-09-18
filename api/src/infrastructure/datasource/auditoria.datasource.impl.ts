import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateAuditoriaDto } from "../../domain/dtos/auditoria/create-auditoria.dto";
import { UpdateAuditoriaDto } from "../../domain/dtos/auditoria/update-auditoria.dto";
import { AuditoriaDatasource } from "../../domain/datasources/auditoria.datasource";
import { AuditoriaEntity } from "../../domain/entitites/auditoria.entity";
import prisma from "../../data/postgres";

export class AuditoriaDatasourceImpl implements AuditoriaDatasource {

    async create(dto: CreateAuditoriaDto): Promise<AuditoriaEntity> {
        const record = await prisma.auditoria.create({
            data: {
                tabla: dto.tabla,
                operacion: dto.operacion,
                usuarioid: dto.usuarioid,
                datosanteriores: dto.datosanteriores,
                datosnuevos: dto.datosnuevos,
                fecha: dto.fecha,
            },
            include: {
                usuarios: true,
            }
        });
        return AuditoriaEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, tabla?: string, usuarioid?: number): Promise<PaginatedResult<AuditoriaEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (tabla) where.tabla = { equals: tabla, mode: 'insensitive' };
        if (usuarioid) where.usuarioid = usuarioid;

        const findOptions: any = {
            where,
            include: {
                usuarios: true,
            },
            orderBy: { auditoriaid: 'desc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.auditoria.count({ where }),
            prisma.auditoria.findMany(findOptions),
        ]);

        return {
            data: records.map(r => AuditoriaEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<AuditoriaEntity | null> {
        const record = await prisma.auditoria.findFirst({
            where: { auditoriaid: id },
            include: {
                usuarios: true,
            }
        });
        if (!record) throw 'Registro de auditoría no encontrado';
        return AuditoriaEntity.fromObject(record);
    }

    async update(dto: UpdateAuditoriaDto): Promise<AuditoriaEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.auditoria.update({
            where: { auditoriaid: dto.id },
            data: dto.values,
            include: {
                usuarios: true,
            }
        });
        return AuditoriaEntity.fromObject(updated);
    }

    async delete(id: number): Promise<AuditoriaEntity> {
        await this.getById(id);
        const deleted = await prisma.auditoria.delete({
            where: { auditoriaid: id },
            include: {
                usuarios: true,
            }
        });
        return AuditoriaEntity.fromObject(deleted);
    }
}
