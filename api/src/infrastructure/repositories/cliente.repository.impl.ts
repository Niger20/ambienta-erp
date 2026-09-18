import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateClienteDto,
    ClienteDatasource, ClienteEntity,
    ClienteRepository,
    UpdateClienteDto
} from "../../domain";


export class ClienteRepositoryImpl implements ClienteRepository {

    constructor(private readonly datasource: ClienteDatasource) {}

    create(createClienteDto: CreateClienteDto): Promise<ClienteEntity> {
        return this.datasource.create(createClienteDto);
    }

    delete(id: number): Promise<ClienteEntity> {
        return this.datasource.delete(id)
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<ClienteEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<ClienteEntity | null> {
        return this.datasource.getById(id);
    }

    update(updateClienteDto: UpdateClienteDto): Promise<ClienteEntity | null> {
        return this.datasource.update(updateClienteDto);
    }

}