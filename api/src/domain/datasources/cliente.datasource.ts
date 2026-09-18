import { PaginatedResult } from "../dtos/shared/pagination.dto";


import {ClienteEntity} from "../entitites/cliente.entity";
import {CreateClienteDto, UpdateClienteDto} from "../dtos";


export abstract class ClienteDatasource {

    abstract create( create : CreateClienteDto): Promise<ClienteEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<ClienteEntity>>;
    abstract getById(id: number): Promise<ClienteEntity|null>;
    abstract update( UpdateClienteDto : UpdateClienteDto): Promise<ClienteEntity|null>;
    abstract delete(id: number): Promise<ClienteEntity>;

}