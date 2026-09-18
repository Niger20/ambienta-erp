import { PlanillaDetalleEntity } from "../../entitites/planilla-detalle.entity";
import { PlanillaDetalleRepository } from "../../repositories/planilla-detalle.repository";

export interface DeletePlanillaDetalleUseCase {
    execute(id: number): Promise<PlanillaDetalleEntity>;
}

export class DeletePlanillaDetalle implements DeletePlanillaDetalleUseCase {
    constructor(private readonly repository: PlanillaDetalleRepository) {}

    execute(id: number): Promise<PlanillaDetalleEntity> {
        return this.repository.delete(id);
    }
}
