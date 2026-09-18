import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateLiquidacionEmpleadoDto } from "../../domain/dtos/liquidacion-empleado/create-liquidacion-empleado.dto";
import { UpdateLiquidacionEmpleadoDto } from "../../domain/dtos/liquidacion-empleado/update-liquidacion-empleado.dto";
import { LiquidacionEmpleadoDatasource } from "../../domain/datasources/liquidacion-empleado.datasource";
import { LiquidacionEmpleadoEntity } from "../../domain/entitites/liquidacion-empleado.entity";
import { LiquidacionEmpleadoRepository } from "../../domain/repositories/liquidacion-empleado.repository";

export class LiquidacionEmpleadoRepositoryImpl implements LiquidacionEmpleadoRepository {
    constructor(private readonly datasource: LiquidacionEmpleadoDatasource) {}

    create(dto: CreateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<LiquidacionEmpleadoEntity>> {
        return this.datasource.getAll(page, limit, empleadoid, estado);
    }

    getById(id: number): Promise<LiquidacionEmpleadoEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateLiquidacionEmpleadoDto): Promise<LiquidacionEmpleadoEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<LiquidacionEmpleadoEntity> {
        return this.datasource.delete(id);
    }
}
