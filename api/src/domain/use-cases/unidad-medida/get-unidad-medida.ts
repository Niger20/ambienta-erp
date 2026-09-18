import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { UnidadMedidaEntity } from "../../entitites/unidad-medida.entity";
import { UnidadMedidaRepository } from "../../repositories/unidad-medida.repository";

export interface GetUnidadMedidaUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<UnidadMedidaEntity>>;
}

export class GetUnidadMedida implements GetUnidadMedidaUseCase {
    constructor(private readonly repository: UnidadMedidaRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<UnidadMedidaEntity>> {
        return this.repository.getAll(page, limit);
    }
}
