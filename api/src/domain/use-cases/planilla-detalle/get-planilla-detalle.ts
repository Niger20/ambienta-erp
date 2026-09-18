import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { PlanillaDetalleEntity } from "../../entitites/planilla-detalle.entity";
import { PlanillaDetalleRepository } from "../../repositories/planilla-detalle.repository";

export interface GetPlanillaDetalleUseCase {
    execute(page?: number, limit?: number, periodoid?: number, empleadoid?: number): Promise<PaginatedResult<PlanillaDetalleEntity>>;
}

export class GetPlanillaDetalle implements GetPlanillaDetalleUseCase {
    constructor(private readonly repository: PlanillaDetalleRepository) {}

    execute(page?: number, limit?: number, periodoid?: number, empleadoid?: number): Promise<PaginatedResult<PlanillaDetalleEntity>> {
        return this.repository.getAll(page, limit, periodoid, empleadoid);
    }
}
