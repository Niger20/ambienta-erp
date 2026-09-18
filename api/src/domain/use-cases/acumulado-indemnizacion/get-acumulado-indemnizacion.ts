import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { AcumuladoIndemnizacionEntity } from "../../entitites/acumulado-indemnizacion.entity";
import { AcumuladoIndemnizacionRepository } from "../../repositories/acumulado-indemnizacion.repository";

export interface GetAcumuladoIndemnizacionUseCase {
    execute(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoIndemnizacionEntity>>;
}

export class GetAcumuladoIndemnizacion implements GetAcumuladoIndemnizacionUseCase {
    constructor(private readonly repository: AcumuladoIndemnizacionRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoIndemnizacionEntity>> {
        return this.repository.getAll(page, limit, empleadoid, periodoid);
    }
}
