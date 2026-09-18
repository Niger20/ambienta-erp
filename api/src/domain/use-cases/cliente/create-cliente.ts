import {ClienteEntity} from "../../entitites/cliente.entity";
import {CreateClienteDto} from "../../dtos";
import {ClienteRepository} from "../../repositories/cliente.repository";


export interface CreateClienteUseCase {
    execute( dto: CreateClienteDto ): Promise<ClienteEntity>;
}

export class CreateCliente implements CreateClienteUseCase {

    constructor(private readonly clienteRepository: ClienteRepository) {}

    execute(dto: CreateClienteDto): Promise<ClienteEntity> {
        return this.clienteRepository.create(dto);
    }

}