import { UpdateLiquidacionEmpleadoDto } from "../../dtos/liquidacion-empleado/update-liquidacion-empleado.dto";
import { LiquidacionEmpleadoEntity } from "../../entitites/liquidacion-empleado.entity";
import { LiquidacionEmpleadoRepository } from "../../repositories/liquidacion-empleado.repository";

export interface UpdateLiquidacionEmpleadoUseCase {
    execute(dto: UpdateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity | null>;
}

export class UpdateLiquidacionEmpleado implements UpdateLiquidacionEmpleadoUseCase {
    constructor(private readonly repository: LiquidacionEmpleadoRepository) {}

    execute(dto: UpdateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity | null> {
        return this.repository.update(dto);
    }
}
