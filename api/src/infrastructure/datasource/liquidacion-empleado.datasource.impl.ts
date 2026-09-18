import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateLiquidacionEmpleadoDto } from "../../domain/dtos/liquidacion-empleado/create-liquidacion-empleado.dto";
import { UpdateLiquidacionEmpleadoDto } from "../../domain/dtos/liquidacion-empleado/update-liquidacion-empleado.dto";
import { LiquidacionEmpleadoDatasource } from "../../domain/datasources/liquidacion-empleado.datasource";
import { LiquidacionEmpleadoEntity } from "../../domain/entitites/liquidacion-empleado.entity";
import prisma from "../../data/postgres";

export class LiquidacionEmpleadoDatasourceImpl implements LiquidacionEmpleadoDatasource {

    async create(dto: CreateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity> {
        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        const record = await prisma.liquidacionesempleados.create({
            data: {
                empleadoid: dto.empleadoid,
                fechaliquidacion: dto.fechaliquidacion,
                tiposalida: dto.tiposalida,
                salariobrutobase: dto.salariobrutobase,
                diaslaborados: dto.diaslaborados,
                vacacionespagadas: dto.vacacionespagadas,
                decimotercerpagado: dto.decimotercerpagado,
                indemnizacionpagada: dto.indemnizacionpagada,
                salariosatrasados: dto.salariosatrasados,
                otrosbeneficios: dto.otrosbeneficios,
                prestamosdescontados: dto.prestamosdescontados,
                anticiposdescontados: dto.anticiposdescontados,
                otrasdeduccionesliq: dto.otrasdeduccionesliq,
                estado: dto.estado,
                usuarioid: dto.usuarioid,
                observaciones: dto.observaciones,
            },
            include: {
                empleados: true,
            }
        });
        return LiquidacionEmpleadoEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<LiquidacionEmpleadoEntity>> {
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
            },
            orderBy: [{ fechaliquidacion: 'desc' }, { liquidacionid: 'desc' }]
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.liquidacionesempleados.count({ where }),
            prisma.liquidacionesempleados.findMany(findOptions),
        ]);

        return {
            data: records.map(r => LiquidacionEmpleadoEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<LiquidacionEmpleadoEntity | null> {
        const record = await prisma.liquidacionesempleados.findFirst({
            where: { liquidacionid: id },
            include: {
                empleados: true,
            }
        });
        if (!record) throw 'Liquidación no encontrada';
        return LiquidacionEmpleadoEntity.fromObject(record);
    }

    async update(dto: UpdateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.liquidacionesempleados.update({
            where: { liquidacionid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
            }
        });
        return LiquidacionEmpleadoEntity.fromObject(updated);
    }

    async delete(id: number): Promise<LiquidacionEmpleadoEntity> {
        await this.getById(id);
        const deleted = await prisma.liquidacionesempleados.delete({
            where: { liquidacionid: id },
            include: {
                empleados: true,
            }
        });
        return LiquidacionEmpleadoEntity.fromObject(deleted);
    }
}
