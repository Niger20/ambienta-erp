import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateFeriadoNacionalDto } from "../../domain/dtos/feriado-nacional/create-feriado-nacional.dto";
import { UpdateFeriadoNacionalDto } from "../../domain/dtos/feriado-nacional/update-feriado-nacional.dto";
import { FeriadoNacionalDatasource } from "../../domain/datasources/feriado-nacional.datasource";
import { FeriadoNacionalEntity } from "../../domain/entitites/feriado-nacional.entity";
import prisma from "../../data/postgres";

export class FeriadoNacionalDatasourceImpl implements FeriadoNacionalDatasource {

    async create(dto: CreateFeriadoNacionalDto): Promise<FeriadoNacionalEntity> {
        const record = await prisma.feriadosnacionales.create({
            data: {
                nombre: dto.nombre,
                fecha: dto.fecha,
                esrecurrente: dto.esrecurrente,
                activo: dto.activo,
            }
        });
        return FeriadoNacionalEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, anio?: number): Promise<PaginatedResult<FeriadoNacionalEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (anio) {
            where.fecha = {
                gte: new Date(`${anio}-01-01`),
                lte: new Date(`${anio}-12-31`),
            };
        }

        const findOptions: any = {
            where,
            orderBy: { fecha: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.feriadosnacionales.count({ where }),
            prisma.feriadosnacionales.findMany(findOptions),
        ]);

        return {
            data: records.map(r => FeriadoNacionalEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<FeriadoNacionalEntity | null> {
        const record = await prisma.feriadosnacionales.findFirst({
            where: { feriadoid: id }
        });
        if (!record) throw 'Feriado nacional no encontrado';
        return FeriadoNacionalEntity.fromObject(record);
    }

    async update(dto: UpdateFeriadoNacionalDto): Promise<FeriadoNacionalEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.feriadosnacionales.update({
            where: { feriadoid: dto.id },
            data: dto.values,
        });
        return FeriadoNacionalEntity.fromObject(updated);
    }

    async delete(id: number): Promise<FeriadoNacionalEntity> {
        await this.getById(id);
        const deleted = await prisma.feriadosnacionales.update({
            where: { feriadoid: id },
            data: { activo: false }
        });
        return FeriadoNacionalEntity.fromObject(deleted);
    }
}
