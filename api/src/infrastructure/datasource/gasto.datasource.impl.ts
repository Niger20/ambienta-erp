import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateGastoDto,
    GastoDatasource,
    GastoEntity,
    UpdateGastoDto
} from "../../domain";
import prisma from "../../data/postgres";


export class GastoDatasourceImpl implements GastoDatasource {

    async create(createGastoDto: CreateGastoDto): Promise<GastoEntity> {
        const gasto = await prisma.gastos.create({
            data: {
                usuarioid: createGastoDto.usuarioid,
                nombre: createGastoDto.nombre,
                descripcion: createGastoDto.descripcion,
            },
            include: {
                usuarios: true,
            },
        });

        return GastoEntity.fromObject(gasto);
    }

    async delete(id: number): Promise<GastoEntity> {
        await this.getById(id);

        const gasto = await prisma.gastos.delete({
            where: { gastoid: id },
            include: {
                usuarios: true,
            },
        });

        return GastoEntity.fromObject(gasto);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<GastoEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            include: {
                usuarios: true,
            },
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, gastos] = await Promise.all([
            prisma.gastos.count(),
            prisma.gastos.findMany(findOptions),
        ]);

        return {
            data: gastos.map((item) => GastoEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getById(id: number): Promise<GastoEntity | null> {
        const gasto = await prisma.gastos.findFirst({
            where: { gastoid: id },
            include: {
                usuarios: true,
            },
        });

        if (!gasto) throw 'Gasto no encontrado';

        return GastoEntity.fromObject(gasto);
    }

    async update(updateGastoDto: UpdateGastoDto): Promise<GastoEntity | null> {
        await this.getById(updateGastoDto.id);

        const updatedGasto = await prisma.gastos.update({
            where: { gastoid: updateGastoDto.id },
            data: updateGastoDto.values,
            include: {
                usuarios: true,
            },
        });

        return GastoEntity.fromObject(updatedGasto);
    }
}
