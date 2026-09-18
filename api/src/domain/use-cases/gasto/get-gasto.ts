import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { GastoEntity } from "../../entitites/gasto.entity";
import { GastoRepository } from "../../repositories/gasto.repository";


export interface GetGastoUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<GastoEntity>>;
}

export class GetGasto implements GetGastoUseCase {

    constructor(private readonly repository: GastoRepository) { }

    execute(page?: number, limit?: number): Promise<PaginatedResult<GastoEntity>> {
        return this.repository.getAll();
    }

}
