import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import {ClienteEntity} from "../../entitites/cliente.entity";
import {ClienteRepository} from "../../repositories/cliente.repository";


export interface GetClienteUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<ClienteEntity>>;
}

export class GetCliente implements GetClienteUseCase {

    constructor(private readonly clienteRepository: ClienteRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<ClienteEntity>> {
        return this.clienteRepository.getAll(page, limit);
    }

}