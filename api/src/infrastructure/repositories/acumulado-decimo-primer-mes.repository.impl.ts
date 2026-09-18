import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateAcumuladoDecimoPrimerMesDto } from "../../domain/dtos/acumulado-decimo-primer-mes/create-acumulado-decimo-primer-mes.dto";
import { UpdateAcumuladoDecimoPrimerMesDto } from "../../domain/dtos/acumulado-decimo-primer-mes/update-acumulado-decimo-primer-mes.dto";
import { AcumuladoDecimoPrimerMesDatasource } from "../../domain/datasources/acumulado-decimo-primer-mes.datasource";
import { AcumuladoDecimoPrimerMesEntity } from "../../domain/entitites/acumulado-decimo-primer-mes.entity";
import { AcumuladoDecimoPrimerMesRepository } from "../../domain/repositories/acumulado-decimo-primer-mes.repository";

export class AcumuladoDecimoPrimerMesRepositoryImpl implements AcumuladoDecimoPrimerMesRepository {
    constructor(private readonly datasource: AcumuladoDecimoPrimerMesDatasource) {}

    create(dto: CreateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, empleadoid?: number, periodoid?: number): Promise<PaginatedResult<AcumuladoDecimoPrimerMesEntity>> {
        return this.datasource.getAll(page, limit, empleadoid, periodoid);
    }

    getById(id: number): Promise<AcumuladoDecimoPrimerMesEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<AcumuladoDecimoPrimerMesEntity> {
        return this.datasource.delete(id);
    }
}
