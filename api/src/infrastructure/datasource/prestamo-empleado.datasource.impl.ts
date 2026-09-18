import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePrestamoEmpleadoDto } from "../../domain/dtos/prestamo-empleado/create-prestamo-empleado.dto";
import { UpdatePrestamoEmpleadoDto } from "../../domain/dtos/prestamo-empleado/update-prestamo-empleado.dto";
import { PrestamoEmpleadoDatasource } from "../../domain/datasources/prestamo-empleado.datasource";
import { PrestamoEmpleadoEntity } from "../../domain/entitites/prestamo-empleado.entity";
import prisma from "../../data/postgres";

export class PrestamoEmpleadoDatasourceImpl implements PrestamoEmpleadoDatasource {

    async create(dto: CreatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        const record = await prisma.$transaction(async (tx) => {
            const prestamo = await tx.prestamosempleados.create({
                data: {
                    empleadoid: dto.empleadoid,
                    monto: dto.monto,
                    numerocuotas: dto.numerocuotas,
                    montocuota: dto.montocuota,
                    fechadesembolso: dto.fechadesembolso,
                    motivo: dto.motivo,
                    estado: dto.estado,
                    usuarioid: dto.usuarioid,
                },
                include: {
                    empleados: true,
                }
            });

            // Generar cuotas automáticamente
            const cuotasData: any[] = [];
            const startDate = new Date(dto.fechadesembolso);
            for (let i = 1; i <= dto.numerocuotas; i++) {
                const dueDate = new Date(startDate);
                dueDate.setMonth(dueDate.getMonth() + i);

                cuotasData.push({
                    prestamoid: prestamo.prestamoid,
                    numerocuota: i,
                    fechavencimiento: dueDate,
                    montocuota: dto.montocuota,
                    estado: 'PENDIENTE',
                });
            }

            if (cuotasData.length > 0) {
                await tx.cuotasprestamos.createMany({
                    data: cuotasData,
                });
            }

            return tx.prestamosempleados.findUnique({
                where: { prestamoid: prestamo.prestamoid },
                include: {
                    empleados: true,
                    cuotasprestamos: {
                        orderBy: { numerocuota: 'asc' }
                    }
                }
            });
        });

        return PrestamoEmpleadoEntity.fromObject(record!);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<PrestamoEmpleadoEntity>> {
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
                cuotasprestamos: {
                    orderBy: { numerocuota: 'asc' }
                }
            },
            orderBy: [{ fechadesembolso: 'desc' }, { prestamoid: 'desc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.prestamosempleados.count({ where }),
            prisma.prestamosempleados.findMany(findOptions),
        ]);

        return {
            data: records.map(r => PrestamoEmpleadoEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<PrestamoEmpleadoEntity | null> {
        const record = await prisma.prestamosempleados.findFirst({
            where: { prestamoid: id },
            include: {
                empleados: true,
                cuotasprestamos: {
                    orderBy: { numerocuota: 'asc' }
                }
            }
        });
        if (!record) throw 'Préstamo no encontrado';
        return PrestamoEmpleadoEntity.fromObject(record);
    }

    async update(dto: UpdatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.prestamosempleados.update({
            where: { prestamoid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
                cuotasprestamos: {
                    orderBy: { numerocuota: 'asc' }
                }
            }
        });
        return PrestamoEmpleadoEntity.fromObject(updated);
    }

    async delete(id: number): Promise<PrestamoEmpleadoEntity> {
        await this.getById(id);
        const deleted = await prisma.$transaction(async (tx) => {
            await tx.cuotasprestamos.deleteMany({
                where: { prestamoid: id }
            });

            return tx.prestamosempleados.delete({
                where: { prestamoid: id },
                include: {
                    empleados: true,
                }
            });
        });

        return PrestamoEmpleadoEntity.fromObject(deleted);
    }
}
