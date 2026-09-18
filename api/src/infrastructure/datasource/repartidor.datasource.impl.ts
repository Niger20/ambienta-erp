import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateRepartidorDto,
    RepartidorDataSource,
    RepartidorEntity,
    UpdateRepartidorDto
} from "../../domain";
import prisma from "../../data/postgres";


export class RepartidorDatasourceImpl implements RepartidorDataSource {

    async create(createRepartidorDto: CreateRepartidorDto): Promise<RepartidorEntity> {
        const repartidor = await prisma.repartidores.create({
            data: {
                nombre: createRepartidorDto.nombre,
                telefono: createRepartidorDto.telefono,
            }
        });

        return RepartidorEntity.fromObject(repartidor);
    }

    async delete(id: number): Promise<RepartidorEntity> {
        await this.getById(id);

        const deletedRepartidor = await prisma.repartidores.delete({
            where: { repartidorid: id }
        });

        return RepartidorEntity.fromObject(deletedRepartidor);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<RepartidorEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, repartidores] = await Promise.all([
            prisma.repartidores.count(),
            prisma.repartidores.findMany(findOptions),
        ]);

        return {
            data: repartidores.map((item) => RepartidorEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getById(id: number): Promise<RepartidorEntity | null> {
        const repartidor = await prisma.repartidores.findFirst({
            where: { repartidorid: id }
        });

        if (!repartidor) throw 'Repartidor not found';

        return RepartidorEntity.fromObject(repartidor);
    }

    async update(updateRepartidorDto: UpdateRepartidorDto): Promise<RepartidorEntity | null> {
        await this.getById(updateRepartidorDto.id);

        const updatedRepartidor = await prisma.repartidores.update({
            where: { repartidorid: updateRepartidorDto.id },
            data: updateRepartidorDto.values
        });

        return RepartidorEntity.fromObject(updatedRepartidor);
    }


}