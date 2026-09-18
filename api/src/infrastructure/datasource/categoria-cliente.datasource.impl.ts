import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateCategoriaClienteDto } from "../../domain/dtos/categoria-cliente/create-categoria-cliente.dto";
import { UpdateCategoriaClienteDto } from "../../domain/dtos/categoria-cliente/update-categoria-cliente.dto";
import { CategoriaClienteDatasource } from "../../domain/datasources/categoria-cliente.datasource";
import { CategoriaClienteEntity } from "../../domain/entitites/categoria-cliente.entity";
import prisma from "../../data/postgres";

export class CategoriaClienteDatasourceImpl implements CategoriaClienteDatasource {

    async create(dto: CreateCategoriaClienteDto): Promise<CategoriaClienteEntity> {
        try {
            const record = await prisma.categoriasclientes.create({
                data: {
                    nombre: dto.nombre,
                    descripcion: dto.descripcion,
                    porcentajedescuento: dto.porcentajedescuento,
                }
            });
            return CategoriaClienteEntity.fromObject(record);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('nombre')) {
                throw 'Ya existe una categoría de cliente con ese nombre';
            }
            throw error;
        }
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<CategoriaClienteEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {
            orderBy: { categoriaclienteid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.categoriasclientes.count(),
            prisma.categoriasclientes.findMany(findOptions),
        ]);

        return {
            data: records.map(r => CategoriaClienteEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<CategoriaClienteEntity | null> {
        const record = await prisma.categoriasclientes.findFirst({
            where: { categoriaclienteid: id }
        });
        if (!record) throw 'Categoría de cliente no encontrada';
        return CategoriaClienteEntity.fromObject(record);
    }

    async update(dto: UpdateCategoriaClienteDto): Promise<CategoriaClienteEntity | null> {
        await this.getById(dto.id);
        try {
            const updated = await prisma.categoriasclientes.update({
                where: { categoriaclienteid: dto.id },
                data: dto.values,
            });
            return CategoriaClienteEntity.fromObject(updated);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('nombre')) {
                throw 'Ya existe una categoría de cliente con ese nombre';
            }
            throw error;
        }
    }

    async delete(id: number): Promise<CategoriaClienteEntity> {
        await this.getById(id);
        const deleted = await prisma.categoriasclientes.delete({
            where: { categoriaclienteid: id }
        });
        return CategoriaClienteEntity.fromObject(deleted);
    }
}
