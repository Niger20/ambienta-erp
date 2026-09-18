import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePeriodoPlanillaDto } from "../../domain/dtos/periodo-planilla/create-periodo-planilla.dto";
import { UpdatePeriodoPlanillaDto } from "../../domain/dtos/periodo-planilla/update-periodo-planilla.dto";
import { PeriodoPlanillaDatasource } from "../../domain/datasources/periodo-planilla.datasource";
import { PeriodoPlanillaEntity } from "../../domain/entitites/periodo-planilla.entity";
import { PeriodoPlanillaRepository } from "../../domain/repositories/periodo-planilla.repository";

export class PeriodoPlanillaRepositoryImpl implements PeriodoPlanillaRepository {
    constructor(private readonly datasource: PeriodoPlanillaDatasource) {}

    create(dto: CreatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, estado?: string): Promise<PaginatedResult<PeriodoPlanillaEntity>> {
        return this.datasource.getAll(page, limit, estado);
    }

    getById(id: number): Promise<PeriodoPlanillaEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<PeriodoPlanillaEntity> {
        return this.datasource.delete(id);
    }
}
