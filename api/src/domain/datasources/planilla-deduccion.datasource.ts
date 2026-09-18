import { CreatePlanillaDeduccionDto } from "../dtos/planilla-deduccion/create-planilla-deduccion.dto";
import { UpdatePlanillaDeduccionDto } from "../dtos/planilla-deduccion/update-planilla-deduccion.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { PlanillaDeduccionEntity } from "../entitites/planilla-deduccion.entity";

export abstract class PlanillaDeduccionDatasource {
    abstract create(dto: CreatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity>;
    abstract getAll(page?: number, limit?: number, detalleid?: number): Promise<PaginatedResult<PlanillaDeduccionEntity>>;
    abstract getById(id: number): Promise<PlanillaDeduccionEntity | null>;
    abstract update(dto: UpdatePlanillaDeduccionDto): Promise<PlanillaDeduccionEntity | null>;
    abstract delete(id: number): Promise<PlanillaDeduccionEntity>;
}
