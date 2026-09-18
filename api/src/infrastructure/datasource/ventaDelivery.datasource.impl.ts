import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateVentaDeliveryDto,
    VentaDeliveryDatasource,
    VentaDeliveryEntity,
} from "../../domain";
import prisma from "../../data/postgres";


export class VentaDeliveryDatasourceImpl implements VentaDeliveryDatasource {

    async create(dto: CreateVentaDeliveryDto): Promise<VentaDeliveryEntity> {
        const ventaDelivery = await prisma.ventadelivery.create({
            data: {
                ventaid: dto.ventaid,
                deliveryid: dto.deliveryid,
            },
        });

        return VentaDeliveryEntity.fromObject(ventaDelivery);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<VentaDeliveryEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.ventadelivery.count(),
            prisma.ventadelivery.findMany(findOptions),
        ]);

        return {
            data: records.map((item) => VentaDeliveryEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getByVentaId(ventaid: number): Promise<VentaDeliveryEntity[]> {
        const records = await prisma.ventadelivery.findMany({
            where: { ventaid },
        });
        return records.map((r) => VentaDeliveryEntity.fromObject(r));
    }

    async getByDeliveryId(deliveryid: number): Promise<VentaDeliveryEntity[]> {
        const records = await prisma.ventadelivery.findMany({
            where: { deliveryid },
        });
        return records.map((r) => VentaDeliveryEntity.fromObject(r));
    }

    async delete(ventaid: number, deliveryid: number): Promise<VentaDeliveryEntity> {
        const ventaDelivery = await prisma.ventadelivery.delete({
            where: {
                ventaid_deliveryid: { ventaid, deliveryid },
            },
        });

        return VentaDeliveryEntity.fromObject(ventaDelivery);
    }
}
