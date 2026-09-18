import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { CategoriaClienteEntity } from "../../entitites/categoria-cliente.entity";
import { CategoriaClienteRepository } from "../../repositories/categoria-cliente.repository";

export interface GetCategoriaClienteUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<CategoriaClienteEntity>>;
}

export class GetCategoriaCliente implements GetCategoriaClienteUseCase {
    constructor(private readonly repository: CategoriaClienteRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<CategoriaClienteEntity>>;
    execute(page?: number, limit?: number): Promise<PaginatedResult<CategoriaClienteEntity>> {
        return this.repository.getAll(page, limit);
    }
}
