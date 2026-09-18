import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateClienteDto,
    ClienteDatasource,
    ClienteEntity,
    UpdateClienteDto
} from "../../domain";
import prisma from "../../data/postgres";


export class ClienteDatasourceImpl implements ClienteDatasource {

    async create(createClienteDto: CreateClienteDto): Promise<ClienteEntity> {
        try {
            const cliente = await prisma.clientes.create({
                data: {
                    nombre: createClienteDto.nombre,
                    cedula: createClienteDto.cedula,
                    telefono: createClienteDto.telefono,
                    direccion: createClienteDto.direccion,
                    ubicaciongeografica: createClienteDto.ubicaciongeografica,
                    limitecredito: createClienteDto.limitecredito,
                    categoriaclienteid: createClienteDto.categoriaclienteid,
                    tipocliente: createClienteDto.tipocliente ?? 'NATURAL',
                    ruc: createClienteDto.ruc,
                },
                include: {
                    categoriasclientes: true,
                },
            });

            return ClienteEntity.fromObject(cliente);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('cedula')) {
                throw 'Ya existe un cliente registrado con esta cédula';
            }
            if (error.code === 'P2002' && error.meta?.target?.includes('ruc')) {
                throw 'Ya existe un cliente registrado con este RUC';
            }
            throw error;
        }
    }

    async delete(id: number): Promise<ClienteEntity> {

        await this.getById(id);

        const deletedCliente = await prisma.clientes.delete({
            where: { clienteid: id }
        });

        return ClienteEntity.fromObject(deletedCliente);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<ClienteEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, clientes] = await Promise.all([
            prisma.clientes.count(),
            prisma.clientes.findMany(findOptions),
        ]);

        return {
            data: clientes.map((item) => ClienteEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async getById(id: number): Promise<ClienteEntity | null> {
        const cliente = await prisma.clientes.findFirst({
            where: { clienteid: id }
        });

        if (!cliente) throw 'Cliente not found';

        return ClienteEntity.fromObject(cliente);
    }

    async update(updateClienteDto: UpdateClienteDto): Promise<ClienteEntity | null> {
        await this.getById(updateClienteDto.id);

        try {
            const updatedCliente = await prisma.clientes.update({
                where: { clienteid: updateClienteDto.id },
                data: updateClienteDto.values
            });

            return ClienteEntity.fromObject(updatedCliente);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('cedula')) {
                throw 'Ya existe un cliente registrado con esta cédula';
            }
            throw error;
        }
    }


}