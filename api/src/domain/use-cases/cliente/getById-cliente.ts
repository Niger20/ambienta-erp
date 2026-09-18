import {ClienteEntity} from "../../entitites/cliente.entity";
import {ClienteRepository} from "../../repositories/cliente.repository";


export interface GetByIdClienteUseCase {
    execute( id : Number ): Promise<ClienteEntity|null>;
}

export class GetByIdCliente implements GetByIdClienteUseCase {

    constructor(private readonly clienteRepository: ClienteRepository) {}

    execute( id : number): Promise<ClienteEntity|null> {
        return this.clienteRepository.getById(id);
    }

}