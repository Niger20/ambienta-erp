import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePlanillaDeduccionDto } from "../../domain/dtos/planilla-deduccion/create-planilla-deduccion.dto";
import { UpdatePlanillaDeduccionDto } from "../../domain/dtos/planilla-deduccion/update-planilla-deduccion.dto";
import { PlanillaDeduccionDatasource } from "../../domain/datasources/planilla-deduccion.datasource";
import { PlanillaDeduccionEntity } from "../../domain/entitites/planilla-deduccion.entity";
import { PlanillaDeduccionRepository } from "../../domain/repositories/planilla-deduccion.repository";

export class PlanillaDeduccionRepositoryImpl implements PlanillaDeduccionRepository {
    constructor(private readonly datasource: PlanillaDeduccionDatasource) {}

    create(dto: CreatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, planilladetalleid?: number): Promise<PaginatedResult<PlanillaDeduccionEntity>> {
        return this.datasource.getAll(page, limit, planilladetalleid);
    }

    getById(id: number): Promise<PlanillaDeduccionEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<PlanillaDeduccionEntity> {
        return this.datasource.delete(id);
    }
}
