import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateCuotaPrestamoDto } from "../../domain/dtos/cuota-prestamo/create-cuota-prestamo.dto";
import { UpdateCuotaPrestamoDto } from "../../domain/dtos/cuota-prestamo/update-cuota-prestamo.dto";
import { CuotaPrestamoDatasource } from "../../domain/datasources/cuota-prestamo.datasource";
import { CuotaPrestamoEntity } from "../../domain/entitites/cuota-prestamo.entity";
import prisma from "../../data/postgres";

export class CuotaPrestamoDatasourceImpl implements CuotaPrestamoDatasource {

    async create(dto: CreateCuotaPrestamoDto): Promise<CuotaPrestamoEntity> {
        const prestamo = await prisma.prestamosempleados.findUnique({
            where: { prestamoid: dto.prestamoid }
        });
        if (!prestamo) throw 'El préstamo especificado no existe';

        const record = await prisma.cuotasprestamos.create({
            data: {
                prestamoid: dto.prestamoid,
                numerocuota: dto.numerocuota,
                montocuota: dto.montocuota,
                fechavencimiento: dto.fechavencimiento,
                fechapago: dto.fechapago,
                estado: dto.estado,
                detalleid: dto.detalleid,
            },
            include: {
                prestamosempleados: {
                    include: { empleados: true }
                }
            }
        });
        return CuotaPrestamoEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, prestamoid?: number, estado?: string): Promise<PaginatedResult<CuotaPrestamoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (prestamoid) where.prestamoid = prestamoid;
        if (estado) where.estado = { equals: estado, mode: 'insensitive' };

        const findOptions: any = {
            where,
            include: {
                prestamosempleados: {
                    include: { empleados: true }
                }
            },
            orderBy: [{ prestamoid: 'asc' }, { numerocuota: 'asc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.cuotasprestamos.count({ where }),
            prisma.cuotasprestamos.findMany(findOptions),
        ]);

        return {
            data: records.map(r => CuotaPrestamoEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<CuotaPrestamoEntity | null> {
        const record = await prisma.cuotasprestamos.findFirst({
            where: { cuotaid: id },
            include: {
                prestamosempleados: {
                    include: { empleados: true }
                }
            }
        });
        if (!record) throw 'Cuota de préstamo no encontrada';
        return CuotaPrestamoEntity.fromObject(record);
    }

    async update(dto: UpdateCuotaPrestamoDto): Promise<CuotaPrestamoEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.cuotasprestamos.update({
            where: { cuotaid: dto.id },
            data: dto.values,
            include: {
                prestamosempleados: {
                    include: { empleados: true }
                }
            }
        });
        return CuotaPrestamoEntity.fromObject(updated);
    }

    async delete(id: number): Promise<CuotaPrestamoEntity> {
        await this.getById(id);
        const deleted = await prisma.cuotasprestamos.delete({
            where: { cuotaid: id },
            include: {
                prestamosempleados: {
                    include: { empleados: true }
                }
            }
        });
        return CuotaPrestamoEntity.fromObject(deleted);
    }
}
