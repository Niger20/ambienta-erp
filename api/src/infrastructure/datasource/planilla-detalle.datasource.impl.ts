import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePlanillaDetalleDto } from "../../domain/dtos/planilla-detalle/create-planilla-detalle.dto";
import { UpdatePlanillaDetalleDto } from "../../domain/dtos/planilla-detalle/update-planilla-detalle.dto";
import { PlanillaDetalleDatasource } from "../../domain/datasources/planilla-detalle.datasource";
import { PlanillaDetalleEntity } from "../../domain/entitites/planilla-detalle.entity";
import prisma from "../../data/postgres";

export class PlanillaDetalleDatasourceImpl implements PlanillaDetalleDatasource {

    async create(dto: CreatePlanillaDetalleDto): Promise<PlanillaDetalleEntity> {
        const periodo = await prisma.periodosplanilla.findUnique({
            where: { periodoid: dto.periodoid }
        });
        if (!periodo) throw 'El período de planilla especificado no existe';

        const empleado = await prisma.empleados.findUnique({
            where: { empleadoid: dto.empleadoid }
        });
        if (!empleado) throw 'El empleado especificado no existe';

        const record = await prisma.planilladetalle.create({
            data: {
                periodoid: dto.periodoid,
                empleadoid: dto.empleadoid,
                salariobruto: dto.salariobruto,
                montohorasextra: dto.montohorasextra,
                comisiones: dto.comisiones,
                pagoferiados: dto.pagoferiados,
                otrosingresos: dto.otrosingresos,
                insslaboral: dto.insslaboral,
                ir: dto.ir,
                otrasdeducciones: dto.otrasdeducciones,
                cuotasprestamos: dto.cuotasprestamos,
                anticipos: dto.anticipos,
                insspatronal: dto.insspatronal,
                estado: dto.estado,
                observaciones: dto.observaciones,
            },
            include: {
                empleados: true,
                periodosplanilla: true,
                planilladeducciones: true,
                planillahorasextra: true,
            }
        });
        return PlanillaDetalleEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, periodoid?: number, empleadoid?: number): Promise<PaginatedResult<PlanillaDetalleEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (periodoid) where.periodoid = periodoid;
        if (empleadoid) where.empleadoid = empleadoid;

        const findOptions: any = {
            where,
            include: {
                empleados: true,
                periodosplanilla: true,
                planilladeducciones: true,
                planillahorasextra: true,
            },
            orderBy: { detalleid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.planilladetalle.count({ where }),
            prisma.planilladetalle.findMany(findOptions),
        ]);

        return {
            data: records.map(r => PlanillaDetalleEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<PlanillaDetalleEntity | null> {
        const record = await prisma.planilladetalle.findFirst({
            where: { detalleid: id },
            include: {
                empleados: true,
                periodosplanilla: true,
                planilladeducciones: true,
                planillahorasextra: true,
                cuotasprestamos_rel: true,
            }
        });
        if (!record) throw 'Detalle de planilla no encontrado';
        return PlanillaDetalleEntity.fromObject(record);
    }

    async update(dto: UpdatePlanillaDetalleDto): Promise<PlanillaDetalleEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.planilladetalle.update({
            where: { detalleid: dto.id },
            data: dto.values,
            include: {
                empleados: true,
                periodosplanilla: true,
                planilladeducciones: true,
                planillahorasextra: true,
            }
        });
        return PlanillaDetalleEntity.fromObject(updated);
    }

    async delete(id: number): Promise<PlanillaDetalleEntity> {
        await this.getById(id);
        const deleted = await prisma.$transaction(async (tx) => {
            await tx.planilladeducciones.deleteMany({ where: { detalleid: id } });
            await tx.planillahorasextra.deleteMany({ where: { detalleid: id } });
            await tx.cuotasprestamos.updateMany({
                where: { detalleid: id },
                data: { detalleid: null, estado: 'PENDIENTE', fechapago: null }
            });

            return tx.planilladetalle.delete({
                where: { detalleid: id },
                include: {
                    empleados: true,
                    periodosplanilla: true,
                }
            });
        });

        return PlanillaDetalleEntity.fromObject(deleted);
    }
}
