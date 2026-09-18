import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateProveedorDto,
    ProveedorDatasource,
    ProveedorEntity,
    UpdateProveedorDto
} from "../../domain";
import prisma from "../../data/postgres";


export class ProveedorDatasourceImpl implements  ProveedorDatasource{

    async create(createProveedorDto: CreateProveedorDto): Promise<ProveedorEntity> {
        const proveedor = await prisma.proveedores.create({
            data: {
                nombreempresa : createProveedorDto.nombreempresa,
                asesorventas : createProveedorDto.asesorventas,
                telefono : createProveedorDto.telefono,
                direccion : createProveedorDto.direccion,
                ubicaciongeografica: createProveedorDto.ubicaciongeografica,
                clasificacion : createProveedorDto.clasificacion,
            }
        })

        return ProveedorEntity.fromObject(proveedor);
    }

    async delete(id: number): Promise<ProveedorEntity> {

        await this.getById( id )

        const deletedProveedor = await prisma.proveedores.delete({
            where: { proveedorid: id }
        });

        return ProveedorEntity.fromObject(deletedProveedor);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<ProveedorEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, proveedor] = await Promise.all([
            prisma.proveedores.count(),
            prisma.proveedores.findMany(findOptions),
        ]);

        return {
            data: proveedor.map((item) => ProveedorEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getById(id: number): Promise<ProveedorEntity | null> {
        const proveedor = await prisma.proveedores.findFirst({
            where: { proveedorid: id }
        });

        if (!proveedor) throw 'Proveedor not found';

        return ProveedorEntity.fromObject(proveedor);
    }

    async update(updateProveedorDto: UpdateProveedorDto): Promise<ProveedorEntity | null> {
        await this.getById( updateProveedorDto.id )

        const updatedProveedor = await prisma.proveedores.update({
            where: { proveedorid: updateProveedorDto.id },
            data: updateProveedorDto!.values
        });

        return ProveedorEntity.fromObject(updatedProveedor);

    }



}