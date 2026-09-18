import {ClienteEntity} from "../../entitites/cliente.entity";
import { UpdateClienteDto} from "../../dtos";
import {ClienteRepository} from "../../repositories/cliente.repository";


export interface UpdateClienteUseCase {
    execute( dto: UpdateClienteDto ): Promise<ClienteEntity|null>;
}

export class UpdateCliente implements UpdateClienteUseCase {

    constructor(private readonly clienteRepository: ClienteRepository) {}

    execute(dto: UpdateClienteDto): Promise<ClienteEntity|null> {
        return this.clienteRepository.update(dto);
    }

}