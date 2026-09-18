import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateConfiguracionInssDto } from "../../domain/dtos/configuracion-inss/create-configuracion-inss.dto";
import { UpdateConfiguracionInssDto } from "../../domain/dtos/configuracion-inss/update-configuracion-inss.dto";
import { ConfiguracionInssDatasource } from "../../domain/datasources/configuracion-inss.datasource";
import { ConfiguracionInssEntity } from "../../domain/entitites/configuracion-inss.entity";
import prisma from "../../data/postgres";

export class ConfiguracionInssDatasourceImpl implements ConfiguracionInssDatasource {

    async create(dto: CreateConfiguracionInssDto): Promise<ConfiguracionInssEntity> {
        const record = await prisma.configuracioninss.create({
            data: {
                tasalaboral: dto.tasalaboral,
                tasapatronal: dto.tasapatronal,
                fechavigencia: dto.fechavigencia,
                fechafinvigencia: dto.fechafinvigencia,
                activo: dto.activo,
                observaciones: dto.observaciones,
            }
        });
        return ConfiguracionInssEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<ConfiguracionInssEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (activo !== undefined) where.activo = activo;

        const findOptions: any = {
            where,
            orderBy: { fechavigencia: 'desc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.configuracioninss.count({ where }),
            prisma.configuracioninss.findMany(findOptions),
        ]);

        return {
            data: records.map(r => ConfiguracionInssEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<ConfiguracionInssEntity | null> {
        const record = await prisma.configuracioninss.findFirst({
            where: { configinssid: id }
        });
        if (!record) throw 'Configuración INSS no encontrada';
        return ConfiguracionInssEntity.fromObject(record);
    }

    async update(dto: UpdateConfiguracionInssDto): Promise<ConfiguracionInssEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.configuracioninss.update({
            where: { configinssid: dto.id },
            data: dto.values,
        });
        return ConfiguracionInssEntity.fromObject(updated);
    }

    async delete(id: number): Promise<ConfiguracionInssEntity> {
        await this.getById(id);
        const deleted = await prisma.configuracioninss.update({
            where: { configinssid: id },
            data: { activo: false }
        });
        return ConfiguracionInssEntity.fromObject(deleted);
    }
}
