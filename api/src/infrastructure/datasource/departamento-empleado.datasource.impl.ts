import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateDepartamentoEmpleadoDto } from "../../domain/dtos/departamento-empleado/create-departamento-empleado.dto";
import { UpdateDepartamentoEmpleadoDto } from "../../domain/dtos/departamento-empleado/update-departamento-empleado.dto";
import { DepartamentoEmpleadoDatasource } from "../../domain/datasources/departamento-empleado.datasource";
import { DepartamentoEmpleadoEntity } from "../../domain/entitites/departamento-empleado.entity";
import prisma from "../../data/postgres";

export class DepartamentoEmpleadoDatasourceImpl implements DepartamentoEmpleadoDatasource {

    async create(dto: CreateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity> {
        try {
            const record = await prisma.departamentosempleados.create({
                data: {
                    nombre: dto.nombre,
                    descripcion: dto.descripcion,
                }
            });
            return DepartamentoEmpleadoEntity.fromObject(record);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('nombre')) {
                throw 'Ya existe un departamento con ese nombre';
            }
            throw error;
        }
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<DepartamentoEmpleadoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            orderBy: { departamentoid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.departamentosempleados.count(),
            prisma.departamentosempleados.findMany(findOptions),
        ]);

        return {
            data: records.map(r => DepartamentoEmpleadoEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<DepartamentoEmpleadoEntity | null> {
        const record = await prisma.departamentosempleados.findFirst({
            where: { departamentoid: id }
        });
        if (!record) throw 'Departamento no encontrado';
        return DepartamentoEmpleadoEntity.fromObject(record);
    }

    async update(dto: UpdateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity | null> {
        await this.getById(dto.id);
        try {
            const updated = await prisma.departamentosempleados.update({
                where: { departamentoid: dto.id },
                data: dto.values,
            });
            return DepartamentoEmpleadoEntity.fromObject(updated);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('nombre')) {
                throw 'Ya existe un departamento con ese nombre';
            }
            throw error;
        }
    }

    async delete(id: number): Promise<DepartamentoEmpleadoEntity> {
        await this.getById(id);
        const deleted = await prisma.departamentosempleados.delete({
            where: { departamentoid: id }
        });
        return DepartamentoEmpleadoEntity.fromObject(deleted);
    }
}
