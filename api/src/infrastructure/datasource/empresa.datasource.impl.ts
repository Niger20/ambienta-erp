import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateEmpresaDto,
    EmpresaDatasource,
    EmpresaEntity,
    UpdateEmpresaDto
} from "../../domain";
import prisma from "../../data/postgres";
import { Prisma } from "../../generated/prisma/client";


export class EmpresaDatasourceImpl implements EmpresaDatasource {

    async create(createEmpresaDto: CreateEmpresaDto): Promise<EmpresaEntity> {
        const empresa = await prisma.empresa.create({
            data: {
                nombreempresa: createEmpresaDto.nombreempresa,
                direccion: createEmpresaDto.direccion,
                telefono: createEmpresaDto.telefono,
                ruc: createEmpresaDto.ruc,
                tasacambio: createEmpresaDto.tasacambio != null ? new Prisma.Decimal(createEmpresaDto.tasacambio) : null,
            }
        });

        return EmpresaEntity.fromObject(empresa);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<EmpresaEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, empresas] = await Promise.all([
            prisma.empresa.count(),
            prisma.empresa.findMany(findOptions),
        ]);

        return {
            data: empresas.map((item) => EmpresaEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async update(updateEmpresaDto: UpdateEmpresaDto): Promise<EmpresaEntity | null> {
        const rawValues = updateEmpresaDto.values;

        // Ensure tasacambio is explicitly converted to Decimal for PrismaPg adapter compatibility
        const data: any = { ...rawValues };
        if (data.tasacambio != null) {
            data.tasacambio = new Prisma.Decimal(data.tasacambio);
        }

        const updatedEmpresa = await prisma.empresa.update({
            where: { empresaid: updateEmpresaDto.id },
            data
        });

        return EmpresaEntity.fromObject(updatedEmpresa);
    }


}