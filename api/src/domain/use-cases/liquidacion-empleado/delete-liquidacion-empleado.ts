import { LiquidacionEmpleadoEntity } from "../../entitites/liquidacion-empleado.entity";
import { LiquidacionEmpleadoRepository } from "../../repositories/liquidacion-empleado.repository";

export interface DeleteLiquidacionEmpleadoUseCase {
    execute(id: number): Promise<LiquidacionEmpleadoEntity>;
}

export class DeleteLiquidacionEmpleado implements DeleteLiquidacionEmpleadoUseCase {
    constructor(private readonly repository: LiquidacionEmpleadoRepository) {}

    execute(id: number): Promise<LiquidacionEmpleadoEntity> {
        return this.repository.delete(id);
    }
}
