import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { LiquidacionEmpleadoEntity } from "../../entitites/liquidacion-empleado.entity";
import { LiquidacionEmpleadoRepository } from "../../repositories/liquidacion-empleado.repository";

export interface GetLiquidacionEmpleadoUseCase {
    execute(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<LiquidacionEmpleadoEntity>>;
}

export class GetLiquidacionEmpleado implements GetLiquidacionEmpleadoUseCase {
    constructor(private readonly repository: LiquidacionEmpleadoRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<LiquidacionEmpleadoEntity>> {
        return this.repository.getAll(page, limit, empleadoid, estado);
    }
}
