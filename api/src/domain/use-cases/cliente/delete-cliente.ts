import {ClienteEntity} from "../../entitites/cliente.entity";
import {ClienteRepository} from "../../repositories/cliente.repository";


export interface DeleteClienteUseCase {
    execute( id: number ): Promise<ClienteEntity>;
}

export class DeleteCliente implements DeleteClienteUseCase {

    constructor(private readonly clienteRepository: ClienteRepository) {}

    execute( id: number): Promise<ClienteEntity> {
        return this.clienteRepository.delete(id);
    }

}