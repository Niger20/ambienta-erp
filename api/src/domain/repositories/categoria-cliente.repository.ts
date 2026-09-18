import { CreateCategoriaClienteDto } from "../dtos/categoria-cliente/create-categoria-cliente.dto";
import { UpdateCategoriaClienteDto } from "../dtos/categoria-cliente/update-categoria-cliente.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { CategoriaClienteEntity } from "../entitites/categoria-cliente.entity";

export abstract class CategoriaClienteRepository {
    abstract create(dto: CreateCategoriaClienteDto): Promise<CategoriaClienteEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<CategoriaClienteEntity>>;
    abstract getById(id: number): Promise<CategoriaClienteEntity | null>;
    abstract update(dto: UpdateCategoriaClienteDto): Promise<CategoriaClienteEntity | null>;
    abstract delete(id: number): Promise<CategoriaClienteEntity>;
}
