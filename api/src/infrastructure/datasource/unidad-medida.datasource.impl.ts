import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateUnidadMedidaDto } from "../../domain/dtos/unidad-medida/create-unidad-medida.dto";
import { UpdateUnidadMedidaDto } from "../../domain/dtos/unidad-medida/update-unidad-medida.dto";
import { UnidadMedidaDatasource } from "../../domain/datasources/unidad-medida.datasource";
import { UnidadMedidaEntity } from "../../domain/entitites/unidad-medida.entity";
import prisma from "../../data/postgres";

export class UnidadMedidaDatasourceImpl implements UnidadMedidaDatasource {

    async create(dto: CreateUnidadMedidaDto): Promise<UnidadMedidaEntity> {
        try {
            const record = await prisma.unidadesmedida.create({
                data: {
                    nombre: dto.nombre,
                    abreviatura: dto.abreviatura,
                    permitefraccionamiento: dto.permitefraccionamiento,
                }
            });
            return UnidadMedidaEntity.fromObject(record);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('nombre')) {
                throw 'Ya existe una unidad de medida con ese nombre';
            }
            throw error;
        }
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<UnidadMedidaEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            orderBy: { unidadmedidaid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.unidadesmedida.count(),
            prisma.unidadesmedida.findMany(findOptions),
        ]);

        return {
            data: records.map(r => UnidadMedidaEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<UnidadMedidaEntity | null> {
        const record = await prisma.unidadesmedida.findFirst({
            where: { unidadmedidaid: id }
        });
        if (!record) throw 'Unidad de medida no encontrada';
        return UnidadMedidaEntity.fromObject(record);
    }

    async update(dto: UpdateUnidadMedidaDto): Promise<UnidadMedidaEntity | null> {
        await this.getById(dto.id);
        try {
            const updated = await prisma.unidadesmedida.update({
                where: { unidadmedidaid: dto.id },
                data: dto.values,
            });
            return UnidadMedidaEntity.fromObject(updated);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('nombre')) {
                throw 'Ya existe una unidad de medida con ese nombre';
            }
            throw error;
        }
    }

    async delete(id: number): Promise<UnidadMedidaEntity> {
        await this.getById(id);
        const deleted = await prisma.unidadesmedida.delete({
            where: { unidadmedidaid: id }
        });
        return UnidadMedidaEntity.fromObject(deleted);
    }
}
