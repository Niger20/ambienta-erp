import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateCargoEmpleadoDto } from "../../domain/dtos/cargo-empleado/create-cargo-empleado.dto";
import { UpdateCargoEmpleadoDto } from "../../domain/dtos/cargo-empleado/update-cargo-empleado.dto";
import { CargoEmpleadoDatasource } from "../../domain/datasources/cargo-empleado.datasource";
import { CargoEmpleadoEntity } from "../../domain/entitites/cargo-empleado.entity";
import prisma from "../../data/postgres";

export class CargoEmpleadoDatasourceImpl implements CargoEmpleadoDatasource {

    async create(dto: CreateCargoEmpleadoDto): Promise<CargoEmpleadoEntity> {
        if (dto.departamentoid) {
            const depto = await prisma.departamentosempleados.findUnique({
                where: { departamentoid: dto.departamentoid }
            });
            if (!depto) throw 'El departamento especificado no existe';
        }

        const record = await prisma.cargosempleados.create({
            data: {
                nombre: dto.nombre,
                departamentoid: dto.departamentoid,
                salariominimoreferencial: dto.salariominimoreferencial,
                salariomaximoreferencial: dto.salariomaximoreferencial,
                descripcion: dto.descripcion,
                estado: dto.estado,
            },
            include: {
                departamentosempleados: true,
            }
        });
        return CargoEmpleadoEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, departamentoid?: number): Promise<PaginatedResult<CargoEmpleadoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (departamentoid) where.departamentoid = departamentoid;

        const findOptions: any = {
            where,
            include: {
                departamentosempleados: true,
            },
            orderBy: { cargoid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.cargosempleados.count({ where }),
            prisma.cargosempleados.findMany(findOptions),
        ]);

        return {
            data: records.map(r => CargoEmpleadoEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<CargoEmpleadoEntity | null> {
        const record = await prisma.cargosempleados.findFirst({
            where: { cargoid: id },
            include: {
                departamentosempleados: true,
            }
        });
        if (!record) throw 'Cargo no encontrado';
        return CargoEmpleadoEntity.fromObject(record);
    }

    async update(dto: UpdateCargoEmpleadoDto): Promise<CargoEmpleadoEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.cargosempleados.update({
            where: { cargoid: dto.id },
            data: dto.values,
            include: {
                departamentosempleados: true,
            }
        });
        return CargoEmpleadoEntity.fromObject(updated);
    }

    async delete(id: number): Promise<CargoEmpleadoEntity> {
        await this.getById(id);
        const deleted = await prisma.cargosempleados.update({
            where: { cargoid: id },
            data: { estado: false },
            include: {
                departamentosempleados: true,
            }
        });
        return CargoEmpleadoEntity.fromObject(deleted);
    }
}
