import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { PagoBeneficioEntity } from "../../entitites/pago-beneficio.entity";
import { PagoBeneficioRepository } from "../../repositories/pago-beneficio.repository";

export interface GetPagoBeneficioUseCase {
    execute(page?: number, limit?: number, empleadoid?: number, tipobeneficio?: string): Promise<PaginatedResult<PagoBeneficioEntity>>;
}

export class GetPagoBeneficio implements GetPagoBeneficioUseCase {
    constructor(private readonly repository: PagoBeneficioRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number, tipobeneficio?: string): Promise<PaginatedResult<PagoBeneficioEntity>> {
        return this.repository.getAll(page, limit, empleadoid, tipobeneficio);
    }
}
