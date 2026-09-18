import { CreatePeriodoPlanillaDto } from "../dtos/periodo-planilla/create-periodo-planilla.dto";
import { UpdatePeriodoPlanillaDto } from "../dtos/periodo-planilla/update-periodo-planilla.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { PeriodoPlanillaEntity } from "../entitites/periodo-planilla.entity";

export abstract class PeriodoPlanillaDatasource {
    abstract create(dto: CreatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity>;
    abstract getAll(page?: number, limit?: number, estado?: string): Promise<PaginatedResult<PeriodoPlanillaEntity>>;
    abstract getById(id: number): Promise<PeriodoPlanillaEntity | null>;
    abstract update(dto: UpdatePeriodoPlanillaDto): Promise<PeriodoPlanillaEntity | null>;
    abstract delete(id: number): Promise<PeriodoPlanillaEntity>;
}
