import { UpdateCategoriaClienteDto } from "../../dtos/categoria-cliente/update-categoria-cliente.dto";
import { CategoriaClienteEntity } from "../../entitites/categoria-cliente.entity";
import { CategoriaClienteRepository } from "../../repositories/categoria-cliente.repository";

export interface UpdateCategoriaClienteUseCase {
    execute(dto: UpdateCategoriaClienteDto): Promise<CategoriaClienteEntity | null>;
}

export class UpdateCategoriaCliente implements UpdateCategoriaClienteUseCase {
    constructor(private readonly repository: CategoriaClienteRepository) {}

    execute(dto: UpdateCategoriaClienteDto): Promise<CategoriaClienteEntity | null> {
        return this.repository.update(dto);
    }
}
