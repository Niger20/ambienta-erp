import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { EmpleadoEntity } from "../../entitites/empleado.entity";
import { EmpleadoRepository } from "../../repositories/empleado.repository";

export interface GetEmpleadoUseCase {
    execute(page?: number, limit?: number, cargoid?: number, estado?: boolean): Promise<PaginatedResult<EmpleadoEntity>>;
}

export class GetEmpleado implements GetEmpleadoUseCase {
    constructor(private readonly repository: EmpleadoRepository) {}

    execute(page?: number, limit?: number, cargoid?: number, estado?: boolean): Promise<PaginatedResult<EmpleadoEntity>> {
        return this.repository.getAll(page, limit, cargoid, estado);
    }
}
