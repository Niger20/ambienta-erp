import { CreateAcumuladoDecimoPrimerMesDto } from "../dtos/acumulado-decimo-primer-mes/create-acumulado-decimo-primer-mes.dto";
import { UpdateAcumuladoDecimoPrimerMesDto } from "../dtos/acumulado-decimo-primer-mes/update-acumulado-decimo-primer-mes.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { AcumuladoDecimoPrimerMesEntity } from "../entitites/acumulado-decimo-primer-mes.entity";

export abstract class AcumuladoDecimoPrimerMesRepository {
    abstract create(dto: CreateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoDecimoPrimerMesEntity>>;
    abstract getById(id: number): Promise<AcumuladoDecimoPrimerMesEntity | null>;
    abstract update(dto: UpdateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity | null>;
    abstract delete(id: number): Promise<AcumuladoDecimoPrimerMesEntity>;
}
