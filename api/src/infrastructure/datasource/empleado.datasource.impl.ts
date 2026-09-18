import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateEmpleadoDto } from "../../domain/dtos/empleado/create-empleado.dto";
import { UpdateEmpleadoDto } from "../../domain/dtos/empleado/update-empleado.dto";
import { EmpleadoDatasource } from "../../domain/datasources/empleado.datasource";
import { EmpleadoEntity } from "../../domain/entitites/empleado.entity";
import prisma from "../../data/postgres";

export class EmpleadoDatasourceImpl implements EmpleadoDatasource {

    async create(dto: CreateEmpleadoDto): Promise<EmpleadoEntity> {
        if (dto.cargoid) {
            const cargo = await prisma.cargosempleados.findUnique({
                where: { cargoid: dto.cargoid }
            });
            if (!cargo) throw 'El cargo especificado no existe';
        }

        if (dto.departamentoid) {
            const depto = await prisma.departamentosempleados.findUnique({
                where: { departamentoid: dto.departamentoid }
            });
            if (!depto) throw 'El departamento especificado no existe';
        }

        const cedulaExists = await prisma.empleados.findUnique({ where: { cedula: dto.cedula } });
        if (cedulaExists) throw 'Ya existe un empleado con esa cédula';

        if (dto.numeroinss) {
            const inssExists = await prisma.empleados.findFirst({ where: { numeroinss: dto.numeroinss } });
            if (inssExists) throw 'Ya existe un empleado con ese número de INSS';
        }

        const record = await prisma.empleados.create({
            data: {
                nombre: dto.nombre,
                apellidos: dto.apellidos,
                cedula: dto.cedula,
                salariobase: dto.salariobase,
                fechaingreso: dto.fechaingreso,
                cargo: dto.cargo,
                tipocontrato: dto.tipocontrato,
                tipojornada: dto.tipojornada,
                horasdiariasjornada: dto.horasdiariasjornada,
                tipopago: dto.tipopago,
                estado: dto.estado,
                numeroinss: dto.numeroinss,
                fechanacimiento: dto.fechanacimiento,
                sexo: dto.sexo,
                telefono: dto.telefono,
                email: dto.email,
                direcciondomicilio: dto.direcciondomicilio,
                departamentoid: dto.departamentoid,
                cargoid: dto.cargoid,
                banco: dto.banco,
                cuentabancaria: dto.cuentabancaria,
                tipocuenta: dto.tipocuenta,
            },
            include: {
                cargosempleados: {
                    include: { departamentosempleados: true }
                },
                departamentosempleados_empleados_departamentoidTodepartamentosempleados: true
            }
        });
        return EmpleadoEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, cargoid?: number, estado?: boolean): Promise<PaginatedResult<EmpleadoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (cargoid) where.cargoid = cargoid;
        if (estado !== undefined) where.estado = estado;

        const findOptions: any = {
            where,
            include: {
                cargosempleados: {
                    include: { departamentosempleados: true }
                },
                departamentosempleados_empleados_departamentoidTodepartamentosempleados: true
            },
            orderBy: { empleadoid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.empleados.count({ where }),
            prisma.empleados.findMany(findOptions),
        ]);

        return {
            data: records.map(r => EmpleadoEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getDeactivated(): Promise<EmpleadoEntity[]> {
        const records = await prisma.empleados.findMany({
            where: { estado: false },
            include: {
                cargosempleados: {
                    include: { departamentosempleados: true }
                },
                departamentosempleados_empleados_departamentoidTodepartamentosempleados: true
            },
            orderBy: { empleadoid: 'asc' }
        });
        return records.map(r => EmpleadoEntity.fromObject(r));
    }

    async getById(id: number): Promise<EmpleadoEntity | null> {
        const record = await prisma.empleados.findFirst({
            where: { empleadoid: id },
            include: {
                cargosempleados: {
                    include: { departamentosempleados: true }
                },
                departamentosempleados_empleados_departamentoidTodepartamentosempleados: true
            }
        });
        if (!record) throw 'Empleado no encontrado';
        return EmpleadoEntity.fromObject(record);
    }

    async update(dto: UpdateEmpleadoDto): Promise<EmpleadoEntity | null> {
        const existing = await this.getById(dto.id);

        if (dto.cedula && dto.cedula !== existing!.cedula) {
            const exists = await prisma.empleados.findUnique({ where: { cedula: dto.cedula } });
            if (exists) throw 'Ya existe un empleado con esa cédula';
        }

        if (dto.numeroinss && dto.numeroinss !== existing!.numeroinss) {
            const exists = await prisma.empleados.findFirst({ where: { numeroinss: dto.numeroinss } });
            if (exists) throw 'Ya existe un empleado con ese número de INSS';
        }

        const updated = await prisma.empleados.update({
            where: { empleadoid: dto.id },
            data: dto.values,
            include: {
                cargosempleados: {
                    include: { departamentosempleados: true }
                },
                departamentosempleados_empleados_departamentoidTodepartamentosempleados: true
            }
        });
        return EmpleadoEntity.fromObject(updated);
    }

    async delete(id: number): Promise<EmpleadoEntity> {
        await this.getById(id);
        const deleted = await prisma.empleados.update({
            where: { empleadoid: id },
            data: { estado: false, fechasalida: new Date() },
            include: {
                cargosempleados: {
                    include: { departamentosempleados: true }
                },
                departamentosempleados_empleados_departamentoidTodepartamentosempleados: true
            }
        });
        return EmpleadoEntity.fromObject(deleted);
    }
}
