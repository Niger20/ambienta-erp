import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateHistorialSalarioDto } from "../../domain/dtos/historial-salario/create-historial-salario.dto";
import { UpdateHistorialSalarioDto } from "../../domain/dtos/historial-salario/update-historial-salario.dto";
import { HistorialSalarioDatasource } from "../../domain/datasources/historial-salario.datasource";
import { HistorialSalarioEntity } from "../../domain/entitites/historial-salario.entity";
import prisma from "../../data/postgres";

export class HistorialSalarioDatasourceImpl implements HistorialSalarioDatasource {

    async create(dto: CreateHistorialSalarioDto): Promise<HistorialSalarioEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        const record = await prisma.$transaction(async (tx) => {
            // Actualizar salario base del empleado
            await tx.empleados.update({
                where: { empleadoid: dto.empleadoid },
                data: { salariobase: dto.salarionuevo }
            });

            return tx.historialsalarios.create({
                data: {
                    empleadoid: dto.empleadoid,
                    salarioanterior: dto.salarioanterior,
                    salarionuevo: dto.salarionuevo,
                    motivo: dto.motivo,
                    fechacambio: dto.fechacambio,
                },
                include: {
                    empleados: true,
                }
            });
        });

        return HistorialSalarioEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number): Promise<PaginatedResult<HistorialSalarioEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (empleadoid) where.empleadoid = empleadoid;

        const findOptions: any = {
            where,
            include: {
                empleados: true,
            },
            orderBy: { fechacambio: 'desc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.historialsalarios.count({ where }),
            prisma.historialsalarios.findMany(findOptions),
        ]);

        return {
            data: records.map(r => HistorialSalarioEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<HistorialSalarioEntity | null> {
        const record = await prisma.historialsalarios.findFirst({
            where: { historialid: id },
            include: {
                empleados: true,
            }
        });
        if (!record) throw 'Registro de historial de salario no encontrado';
        return HistorialSalarioEntity.fromObject(record);
    }

    async update(dto: UpdateHistorialSalarioDto): Promise<HistorialSalarioEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.historialsalarios.update({
            where: { historialid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
            }
        });
        return HistorialSalarioEntity.fromObject(updated);
    }

    async delete(id: number): Promise<HistorialSalarioEntity> {
        await this.getById(id);
        const deleted = await prisma.historialsalarios.delete({
            where: { historialid: id },
            include: {
                empleados: true,
            }
        });
        return HistorialSalarioEntity.fromObject(deleted);
    }
}
