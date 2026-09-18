import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateAnticipoSalarioDto } from "../../domain/dtos/anticipo-salario/create-anticipo-salario.dto";
import { UpdateAnticipoSalarioDto } from "../../domain/dtos/anticipo-salario/update-anticipo-salario.dto";
import { AnticipoSalarioDatasource } from "../../domain/datasources/anticipo-salario.datasource";
import { AnticipoSalarioEntity } from "../../domain/entitites/anticipo-salario.entity";
import prisma from "../../data/postgres";

export class AnticipoSalarioDatasourceImpl implements AnticipoSalarioDatasource {

    async create(dto: CreateAnticipoSalarioDto): Promise<AnticipoSalarioEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        if (dto.descontadoenperiodoid) {
            const periodo = await prisma.periodosplanilla.findUnique({
                where: { periodoid: dto.descontadoenperiodoid }
            });
            if (!periodo) throw 'El período especificado no existe';
        }

        const record = await prisma.anticipossalario.create({
            data: {
                empleadoid: dto.empleadoid,
                monto: dto.monto,
                fechaanticipoid: dto.fechaanticipoid,
                descontadoenperiodoid: dto.descontadoenperiodoid,
                estado: dto.estado,
                usuarioid: dto.usuarioid,
            },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AnticipoSalarioEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number, mes?: number, anio?: number, estado?: string): Promise<PaginatedResult<AnticipoSalarioEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (empleadoid) where.empleadoid = empleadoid;
        if (estado) where.estado = { equals: estado, mode: 'insensitive' };
        if (anio && mes) {
            where.fechaanticipoid = {
                gte: new Date(anio, mes - 1, 1),
                lt: new Date(anio, mes, 1),
            };
        } else if (anio) {
            where.fechaanticipoid = {
                gte: new Date(anio, 0, 1),
                lt: new Date(anio + 1, 0, 1),
            };
        }

        const findOptions: any = {
            where,
            include: {
                empleados: true,
                periodosplanilla: true,
            },
            orderBy: { fechaanticipoid: 'desc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.anticipossalario.count({ where }),
            prisma.anticipossalario.findMany(findOptions),
        ]);

        return {
            data: records.map(r => AnticipoSalarioEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<AnticipoSalarioEntity | null> {
        const record = await prisma.anticipossalario.findFirst({
            where: { anticipoid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        if (!record) throw 'Anticipo no encontrado';
        return AnticipoSalarioEntity.fromObject(record);
    }

    async update(dto: UpdateAnticipoSalarioDto): Promise<AnticipoSalarioEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.anticipossalario.update({
            where: { anticipoid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AnticipoSalarioEntity.fromObject(updated);
    }

    async delete(id: number): Promise<AnticipoSalarioEntity> {
        await this.getById(id);
        const deleted = await prisma.anticipossalario.delete({
            where: { anticipoid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return AnticipoSalarioEntity.fromObject(deleted);
    }
}
