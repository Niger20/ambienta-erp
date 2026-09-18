import { PlanillaDetalleEntity } from "../../entitites/planilla-detalle.entity";
import { PlanillaDetalleRepository } from "../../repositories/planilla-detalle.repository";

export interface GetByIdPlanillaDetalleUseCase {
    execute(id: number): Promise<PlanillaDetalleEntity | null>;
}

export class GetByIdPlanillaDetalle implements GetByIdPlanillaDetalleUseCase {
    constructor(private readonly repository: PlanillaDetalleRepository) {}

    execute(id: number): Promise<PlanillaDetalleEntity | null> {
        return this.repository.getById(id);
    }
}
