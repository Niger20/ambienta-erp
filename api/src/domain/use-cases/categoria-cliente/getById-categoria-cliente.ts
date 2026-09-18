import { CategoriaClienteEntity } from "../../entitites/categoria-cliente.entity";
import { CategoriaClienteRepository } from "../../repositories/categoria-cliente.repository";

export interface GetByIdCategoriaClienteUseCase {
    execute(id: number): Promise<CategoriaClienteEntity | null>;
}

export class GetByIdCategoriaCliente implements GetByIdCategoriaClienteUseCase {
    constructor(private readonly repository: CategoriaClienteRepository) {}

    execute(id: number): Promise<CategoriaClienteEntity | null> {
        return this.repository.getById(id);
    }
}
