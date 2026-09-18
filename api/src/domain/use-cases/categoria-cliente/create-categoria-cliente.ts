import { CreateCategoriaClienteDto } from "../../dtos/categoria-cliente/create-categoria-cliente.dto";
import { CategoriaClienteEntity } from "../../entitites/categoria-cliente.entity";
import { CategoriaClienteRepository } from "../../repositories/categoria-cliente.repository";

export interface CreateCategoriaClienteUseCase {
    execute(dto: CreateCategoriaClienteDto): Promise<CategoriaClienteEntity>;
}

export class CreateCategoriaCliente implements CreateCategoriaClienteUseCase {
    constructor(private readonly repository: CategoriaClienteRepository) {}

    execute(dto: CreateCategoriaClienteDto): Promise<CategoriaClienteEntity> {
        return this.repository.create(dto);
    }
}
