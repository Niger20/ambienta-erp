import { CreatePlanillaDetalleDto } from "../../dtos/planilla-detalle/create-planilla-detalle.dto";
import { PlanillaDetalleEntity } from "../../entitites/planilla-detalle.entity";
import { PlanillaDetalleRepository } from "../../repositories/planilla-detalle.repository";

export interface CreatePlanillaDetalleUseCase {
    execute(dto: CreatePlanillaDetalleDto): Promise<PlanillaDetalleEntity>;
}

export class CreatePlanillaDetalle implements CreatePlanillaDetalleUseCase {
    constructor(private readonly repository: PlanillaDetalleRepository) {}

    execute(dto: CreatePlanillaDetalleDto): Promise<PlanillaDetalleEntity> {
        return this.repository.create(dto);
    }
}
