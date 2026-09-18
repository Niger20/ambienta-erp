import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { AcumuladoDecimoPrimerMesEntity } from "../../entitites/acumulado-decimo-primer-mes.entity";
import { AcumuladoDecimoPrimerMesRepository } from "../../repositories/acumulado-decimo-primer-mes.repository";

export interface GetAcumuladoDecimoPrimerMesUseCase {
    execute(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoDecimoPrimerMesEntity>>;
}

export class GetAcumuladoDecimoPrimerMes implements GetAcumuladoDecimoPrimerMesUseCase {
    constructor(private readonly repository: AcumuladoDecimoPrimerMesRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoDecimoPrimerMesEntity>> {
        return this.repository.getAll(page, limit, empleadoid, periodoid);
    }
}
