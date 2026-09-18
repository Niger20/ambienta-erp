import { CreateLiquidacionEmpleadoDto } from "../dtos/liquidacion-empleado/create-liquidacion-empleado.dto";
import { UpdateLiquidacionEmpleadoDto } from "../dtos/liquidacion-empleado/update-liquidacion-empleado.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { LiquidacionEmpleadoEntity } from "../entitites/liquidacion-empleado.entity";

export abstract class LiquidacionEmpleadoRepository {
    abstract create(dto: CreateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<LiquidacionEmpleadoEntity>>;
    abstract getById(id: number): Promise<LiquidacionEmpleadoEntity | null>;
    abstract update(dto: UpdateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity | null>;
    abstract delete(id: number): Promise<LiquidacionEmpleadoEntity>;
}
