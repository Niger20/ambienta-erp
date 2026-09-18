import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { FeriadoNacionalEntity } from "../../entitites/feriado-nacional.entity";
import { FeriadoNacionalRepository } from "../../repositories/feriado-nacional.repository";

export interface GetFeriadoNacionalUseCase {
    execute(page?: number, limit?: number, anio?: number): Promise<PaginatedResult<FeriadoNacionalEntity>>;
}

export class GetFeriadoNacional implements GetFeriadoNacionalUseCase {
    constructor(private readonly repository: FeriadoNacionalRepository) {}

    execute(page?: number, limit?: number, anio?: number): Promise<PaginatedResult<FeriadoNacionalEntity>> {
        return this.repository.getAll(page, limit, anio);
    }
}
