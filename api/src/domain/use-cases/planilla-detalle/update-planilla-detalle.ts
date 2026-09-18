import { UpdatePlanillaDetalleDto } from "../../dtos/planilla-detalle/update-planilla-detalle.dto";
import { PlanillaDetalleEntity } from "../../entitites/planilla-detalle.entity";
import { PlanillaDetalleRepository } from "../../repositories/planilla-detalle.repository";

export interface UpdatePlanillaDetalleUseCase {
    execute(dto: UpdatePlanillaDetalleDto): Promise<PlanillaDetalleEntity | null>;
}

export class UpdatePlanillaDetalle implements UpdatePlanillaDetalleUseCase {
    constructor(private readonly repository: PlanillaDetalleRepository) {}

    execute(dto: UpdatePlanillaDetalleDto): Promise<PlanillaDetalleEntity | null> {
        return this.repository.update(dto);
    }
}
