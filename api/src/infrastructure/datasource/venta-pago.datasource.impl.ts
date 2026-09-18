import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateVentaPagoDto } from "../../domain/dtos/venta-pago/create-venta-pago.dto";
import { UpdateVentaPagoDto } from "../../domain/dtos/venta-pago/update-venta-pago.dto";
import { VentaPagoDatasource } from "../../domain/datasources/venta-pago.datasource";
import { VentaPagoEntity } from "../../domain/entitites/venta-pago.entity";
import prisma from "../../data/postgres";

export class VentaPagoDatasourceImpl implements VentaPagoDatasource {

    async create(dto: CreateVentaPagoDto): Promise<VentaPagoEntity> {
        const venta = await prisma.ventas.findUnique({
            where: { ventaid: dto.ventaid }
        });
        if (!venta) throw 'La venta especificada no existe';

        const record = await prisma.ventapagos.create({
            data: {
                ventaid: dto.ventaid,
                metodopago: dto.metodopago,
                monto: dto.monto,
                banco: dto.banco,
                numerotransferencia: dto.numerotransferencia,
            }
        });
        return VentaPagoEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, ventaid?: number): Promise<PaginatedResult<VentaPagoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (ventaid) where.ventaid = ventaid;

        const findOptions: any = {
            where,
            orderBy: { ventapagoid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.ventapagos.count({ where }),
            prisma.ventapagos.findMany(findOptions),
        ]);

        return {
            data: records.map(r => VentaPagoEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<VentaPagoEntity | null> {
        const record = await prisma.ventapagos.findFirst({
            where: { ventapagoid: id }
        });
        if (!record) throw 'Pago de venta no encontrado';
        return VentaPagoEntity.fromObject(record);
    }

    async update(dto: UpdateVentaPagoDto): Promise<VentaPagoEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.ventapagos.update({
            where: { ventapagoid: dto.id },
            data: dto.values,
        });
        return VentaPagoEntity.fromObject(updated);
    }

    async delete(id: number): Promise<VentaPagoEntity> {
        await this.getById(id);
        const deleted = await prisma.ventapagos.delete({
            where: { ventapagoid: id }
        });
        return VentaPagoEntity.fromObject(deleted);
    }
}
