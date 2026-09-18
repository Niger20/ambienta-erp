import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePagoBeneficioDto } from "../../domain/dtos/pago-beneficio/create-pago-beneficio.dto";
import { UpdatePagoBeneficioDto } from "../../domain/dtos/pago-beneficio/update-pago-beneficio.dto";
import { PagoBeneficioDatasource } from "../../domain/datasources/pago-beneficio.datasource";
import { PagoBeneficioEntity } from "../../domain/entitites/pago-beneficio.entity";
import prisma from "../../data/postgres";

export class PagoBeneficioDatasourceImpl implements PagoBeneficioDatasource {

    async create(dto: CreatePagoBeneficioDto): Promise<PagoBeneficioEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        if (dto.periodoid) {
            const periodo = await prisma.periodosplanilla.findUnique({
                where: { periodoid: dto.periodoid }
            });
            if (!periodo) throw 'El período especificado no existe';
        }

        const record = await prisma.pagosbeneficios.create({
            data: {
                empleadoid: dto.empleadoid,
                tipobeneficio: dto.tipobeneficio,
                montopagado: dto.montopagado,
                fechapago: dto.fechapago,
                periodoid: dto.periodoid,
                observaciones: dto.observaciones,
                usuarioid: dto.usuarioid,
            },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return PagoBeneficioEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number, tipobeneficio?: string): Promise<PaginatedResult<PagoBeneficioEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (empleadoid) where.empleadoid = empleadoid;
        if (tipobeneficio) where.tipobeneficio = { equals: tipobeneficio, mode: 'insensitive' };

        const findOptions: any = {
            where,
            include: {
                empleados: true,
                periodosplanilla: true,
            },
            orderBy: [{ fechapago: 'desc' }, { pagobeneficioid: 'desc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.pagosbeneficios.count({ where }),
            prisma.pagosbeneficios.findMany(findOptions),
        ]);

        return {
            data: records.map(r => PagoBeneficioEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<PagoBeneficioEntity | null> {
        const record = await prisma.pagosbeneficios.findFirst({
            where: { pagobeneficioid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        if (!record) throw 'Pago de beneficio no encontrado';
        return PagoBeneficioEntity.fromObject(record);
    }

    async update(dto: UpdatePagoBeneficioDto): Promise<PagoBeneficioEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.pagosbeneficios.update({
            where: { pagobeneficioid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return PagoBeneficioEntity.fromObject(updated);
    }

    async delete(id: number): Promise<PagoBeneficioEntity> {
        await this.getById(id);
        const deleted = await prisma.pagosbeneficios.delete({
            where: { pagobeneficioid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
            }
        });
        return PagoBeneficioEntity.fromObject(deleted);
    }
}
