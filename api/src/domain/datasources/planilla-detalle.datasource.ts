import { CreatePlanillaDetalleDto } from "../dtos/planilla-detalle/create-planilla-detalle.dto";
import { UpdatePlanillaDetalleDto } from "../dtos/planilla-detalle/update-planilla-detalle.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { PlanillaDetalleEntity } from "../entitites/planilla-detalle.entity";

export abstract class PlanillaDetalleDatasource {
    abstract create(dto: CreatePlanillaDetalleDto): Promise<PlanillaDetalleEntity>;
    abstract getAll(page?: number, limit?: number, periodoid?: number, empleadoid?: number): Promise<PaginatedResult<PlanillaDetalleEntity>>;
    abstract getById(id: number): Promise<PlanillaDetalleEntity | null>;
    abstract update(dto: UpdatePlanillaDetalleDto): Promise<PlanillaDetalleEntity | null>;
    abstract delete(id: number): Promise<PlanillaDetalleEntity>;
}
