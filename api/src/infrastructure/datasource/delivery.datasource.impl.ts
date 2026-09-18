import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateDeliveryDto,
    DeliveryDatasource,
    DeliveryEntity,
    UpdateDeliveryDto
} from "../../domain";
import prisma from "../../data/postgres";


export class DeliveryDatasourceImpl implements DeliveryDatasource {

    async create(createDeliveryDto: CreateDeliveryDto): Promise<DeliveryEntity> {
        const delivery = await prisma.deliveries.create({
            data: {
                repartidorid: createDeliveryDto.repartidorid,
                direccionentrega: createDeliveryDto.direccionentrega,
                costo: createDeliveryDto.costo,
                fecha: createDeliveryDto.fecha,
                estado: createDeliveryDto.estado,
            },
            include: {
                repartidores: true,
            },
        });

        return DeliveryEntity.fromObject(delivery);
    }

    async delete(id: number): Promise<DeliveryEntity> {
        await this.getById(id);

        const updatedDelivery = await prisma.deliveries.update({
            where: { deliveryid: id },
            data: { estado: false },
            include: {
                repartidores: true,
            },
        });

        return DeliveryEntity.fromObject(updatedDelivery);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<DeliveryEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            where: { estado: true },
            include: {
                repartidores: true,
            },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, deliveries] = await Promise.all([
            prisma.deliveries.count({ where: { estado: true } }),
            prisma.deliveries.findMany(findOptions),
        ]);

        return {
            data: deliveries.map((item) => DeliveryEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getDeactivated(): Promise<DeliveryEntity[]> {
        const deliveries = await prisma.deliveries.findMany({
            where: { estado: false },
            include: {
                repartidores: true,
            },
        });
        return deliveries.map((delivery) => DeliveryEntity.fromObject(delivery));
    }

    async getById(id: number): Promise<DeliveryEntity | null> {
        const delivery = await prisma.deliveries.findFirst({
            where: { deliveryid: id },
            include: {
                repartidores: true,
            },
        });

        if (!delivery) throw 'Delivery not found';

        return DeliveryEntity.fromObject(delivery);
    }

    async update(updateDeliveryDto: UpdateDeliveryDto): Promise<DeliveryEntity | null> {
        await this.getById(updateDeliveryDto.id);

        const updatedDelivery = await prisma.deliveries.update({
            where: { deliveryid: updateDeliveryDto.id },
            data: updateDeliveryDto.values,
            include: {
                repartidores: true,
            },
        });

        return DeliveryEntity.fromObject(updatedDelivery);
    }
}
