import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePlanillaHoraExtraDto } from "../../domain/dtos/planilla-hora-extra/create-planilla-hora-extra.dto";
import { UpdatePlanillaHoraExtraDto } from "../../domain/dtos/planilla-hora-extra/update-planilla-hora-extra.dto";
import { PlanillaHoraExtraDatasource } from "../../domain/datasources/planilla-hora-extra.datasource";
import { PlanillaHoraExtraEntity } from "../../domain/entitites/planilla-hora-extra.entity";
import { PlanillaHoraExtraRepository } from "../../domain/repositories/planilla-hora-extra.repository";

export class PlanillaHoraExtraRepositoryImpl implements PlanillaHoraExtraRepository {
    constructor(private readonly datasource: PlanillaHoraExtraDatasource) {}

    create(dto: CreatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, planilladetalleid?: number): Promise<PaginatedResult<PlanillaHoraExtraEntity>> {
        return this.datasource.getAll(page, limit, planilladetalleid);
    }

    getById(id: number): Promise<PlanillaHoraExtraEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<PlanillaHoraExtraEntity> {
        return this.datasource.delete(id);
    }
}
