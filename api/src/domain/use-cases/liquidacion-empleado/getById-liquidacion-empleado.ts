import { LiquidacionEmpleadoEntity } from "../../entitites/liquidacion-empleado.entity";
import { LiquidacionEmpleadoRepository } from "../../repositories/liquidacion-empleado.repository";

export interface GetByIdLiquidacionEmpleadoUseCase {
    execute(id: number): Promise<LiquidacionEmpleadoEntity | null>;
}

export class GetByIdLiquidacionEmpleado implements GetByIdLiquidacionEmpleadoUseCase {
    constructor(private readonly repository: LiquidacionEmpleadoRepository) {}

    execute(id: number): Promise<LiquidacionEmpleadoEntity | null> {
        return this.repository.getById(id);
    }
}
