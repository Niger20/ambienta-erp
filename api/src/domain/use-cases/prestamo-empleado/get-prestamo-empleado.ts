import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { PrestamoEmpleadoEntity } from "../../entitites/prestamo-empleado.entity";
import { PrestamoEmpleadoRepository } from "../../repositories/prestamo-empleado.repository";

export interface GetPrestamoEmpleadoUseCase {
    execute(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<PrestamoEmpleadoEntity>>;
}

export class GetPrestamoEmpleado implements GetPrestamoEmpleadoUseCase {
    constructor(private readonly repository: PrestamoEmpleadoRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<PrestamoEmpleadoEntity>> {
        return this.repository.getAll(page, limit, empleadoid, estado);
    }
}
