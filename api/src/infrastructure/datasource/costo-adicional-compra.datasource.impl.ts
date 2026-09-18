import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateCostoAdicionalCompraDto } from "../../domain/dtos/costo-adicional-compra/create-costo-adicional-compra.dto";
import { UpdateCostoAdicionalCompraDto } from "../../domain/dtos/costo-adicional-compra/update-costo-adicional-compra.dto";
import { CostoAdicionalCompraDatasource } from "../../domain/datasources/costo-adicional-compra.datasource";
import { CostoAdicionalCompraEntity } from "../../domain/entitites/costo-adicional-compra.entity";
import prisma from "../../data/postgres";

export class CostoAdicionalCompraDatasourceImpl implements CostoAdicionalCompraDatasource {

    async create(dto: CreateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity> {
        const compra = await prisma.compras.findUnique({
            where: { compraid: dto.compraid }
        });
        if (!compra) throw 'La compra especificada no existe';

        const record = await prisma.costosadicionalescompras.create({
            data: {
                compraid: dto.compraid,
                concepto: dto.concepto,
                monto: dto.monto,
            }
        });
        return CostoAdicionalCompraEntity.fromObject(record);
    }

    async getAll(page?: number, limit?: number, compraid?: number): Promise<PaginatedResult<CostoAdicionalCompraEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const where: any = {};
        if (compraid) where.compraid = compraid;

        const findOptions: any = {
            where,
            orderBy: { costoadicionalid: 'asc' }
        };
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, records] = await Promise.all([
            prisma.costosadicionalescompras.count({ where }),
            prisma.costosadicionalescompras.findMany(findOptions),
        ]);

        return {
            data: records.map(r => CostoAdicionalCompraEntity.fromObject(r)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            }
        };
    }

    async getById(id: number): Promise<CostoAdicionalCompraEntity | null> {
        const record = await prisma.costosadicionalescompras.findFirst({
            where: { costoadicionalid: id }
        });
        if (!record) throw 'Costo adicional no encontrado';
        return CostoAdicionalCompraEntity.fromObject(record);
    }

    async update(dto: UpdateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity | null> {
        await this.getById(dto.id);
        const updated = await prisma.costosadicionalescompras.update({
            where: { costoadicionalid: dto.id },
            data: dto.values,
        });
        return CostoAdicionalCompraEntity.fromObject(updated);
    }

    async delete(id: number): Promise<CostoAdicionalCompraEntity> {
        await this.getById(id);
        const deleted = await prisma.costosadicionalescompras.delete({
            where: { costoadicionalid: id }
        });
        return CostoAdicionalCompraEntity.fromObject(deleted);
    }
}
