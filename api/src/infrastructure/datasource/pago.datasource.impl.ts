import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreatePagoDto,
    PagoDatasource,
    PagoEntity,
    UpdatePagoDto
} from "../../domain";
import prisma from "../../data/postgres";


export class PagoDatasourceImpl implements PagoDatasource {

    async create(createPagoDto: CreatePagoDto): Promise<PagoEntity> {
        const pago = await prisma.pagos.create({
            data: {
                monto: createPagoDto.monto,
                fecha: createPagoDto.fecha,
                metodopago: createPagoDto.metodopago,
                estado: createPagoDto.estado ?? true,
            }
        });

        return PagoEntity.fromObject(pago);
    }

    async delete(id: number): Promise<PagoEntity> {
        const existing = await this.getById(id);

        await prisma.pagos.delete({
            where: { pagoid: id }
        });

        return existing!;
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<PagoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, pagos] = await Promise.all([
            prisma.pagos.count(),
            prisma.pagos.findMany(findOptions),
        ]);

        return {
            data: pagos.map((item) => PagoEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getDeactivated(): Promise<PagoEntity[]> {
        return [];
    }

    async getById(id: number): Promise<PagoEntity | null> {
        const pago = await prisma.pagos.findFirst({
            where: { pagoid: id }
        });

        if (!pago) throw 'Pago not found';

        return PagoEntity.fromObject(pago);
    }

    async update(updatePagoDto: UpdatePagoDto): Promise<PagoEntity | null> {
        await this.getById(updatePagoDto.id);

        const dataToUpdate: any = {};
        if (updatePagoDto.values.monto !== undefined) dataToUpdate.monto = updatePagoDto.values.monto;
        if (updatePagoDto.values.fecha !== undefined) dataToUpdate.fecha = updatePagoDto.values.fecha;
        if (updatePagoDto.values.metodopago !== undefined) dataToUpdate.metodopago = updatePagoDto.values.metodopago;
        if (updatePagoDto.values.estado !== undefined) dataToUpdate.estado = updatePagoDto.values.estado;

        const updatedPago = await prisma.pagos.update({
            where: { pagoid: updatePagoDto.id },
            data: dataToUpdate
        });

        return PagoEntity.fromObject(updatedPago);
    }


}