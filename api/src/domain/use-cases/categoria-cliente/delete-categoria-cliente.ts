import { CategoriaClienteEntity } from "../../entitites/categoria-cliente.entity";
import { CategoriaClienteRepository } from "../../repositories/categoria-cliente.repository";

export interface DeleteCategoriaClienteUseCase {
    execute(id: number): Promise<CategoriaClienteEntity>;
}

export class DeleteCategoriaCliente implements DeleteCategoriaClienteUseCase {
    constructor(private readonly repository: CategoriaClienteRepository) {}

    execute(id: number): Promise<CategoriaClienteEntity> {
        return this.repository.delete(id);
    }
}
