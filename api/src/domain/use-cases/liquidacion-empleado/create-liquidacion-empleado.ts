import { CreateLiquidacionEmpleadoDto } from "../../dtos/liquidacion-empleado/create-liquidacion-empleado.dto";
import { LiquidacionEmpleadoEntity } from "../../entitites/liquidacion-empleado.entity";
import { LiquidacionEmpleadoRepository } from "../../repositories/liquidacion-empleado.repository";

export interface CreateLiquidacionEmpleadoUseCase {
    execute(dto: CreateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity>;
}

export class CreateLiquidacionEmpleado implements CreateLiquidacionEmpleadoUseCase {
    constructor(private readonly repository: LiquidacionEmpleadoRepository) {}

    execute(dto: CreateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity> {
        return this.repository.create(dto);
    }
}
