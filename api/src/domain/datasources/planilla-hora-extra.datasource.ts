import { CreatePlanillaHoraExtraDto } from "../dtos/planilla-hora-extra/create-planilla-hora-extra.dto";
import { UpdatePlanillaHoraExtraDto } from "../dtos/planilla-hora-extra/update-planilla-hora-extra.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { PlanillaHoraExtraEntity } from "../entitites/planilla-hora-extra.entity";

export abstract class PlanillaHoraExtraDatasource {
    abstract create(dto: CreatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity>;
    abstract getAll(page?: number, limit?: number, detalleid?: number): Promise<PaginatedResult<PlanillaHoraExtraEntity>>;
    abstract getById(id: number): Promise<PlanillaHoraExtraEntity | null>;
    abstract update(dto: UpdatePlanillaHoraExtraDto): Promise<PlanillaHoraExtraEntity | null>;
    abstract delete(id: number): Promise<PlanillaHoraExtraEntity>;
}
