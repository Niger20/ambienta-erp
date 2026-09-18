import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { DepartamentoEmpleadoEntity } from "../../entitites/departamento-empleado.entity";
import { DepartamentoEmpleadoRepository } from "../../repositories/departamento-empleado.repository";

export interface GetDepartamentoEmpleadoUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<DepartamentoEmpleadoEntity>>;
}

export class GetDepartamentoEmpleado implements GetDepartamentoEmpleadoUseCase {
    constructor(private readonly repository: DepartamentoEmpleadoRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<DepartamentoEmpleadoEntity>> {
        return this.repository.getAll(page, limit);
    }
}
