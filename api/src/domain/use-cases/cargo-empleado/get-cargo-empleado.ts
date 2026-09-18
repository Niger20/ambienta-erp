import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { CargoEmpleadoEntity } from "../../entitites/cargo-empleado.entity";
import { CargoEmpleadoRepository } from "../../repositories/cargo-empleado.repository";

export interface GetCargoEmpleadoUseCase {
    execute(page?: number, limit?: number, departamentoid?: number): Promise<PaginatedResult<CargoEmpleadoEntity>>;
}

export class GetCargoEmpleado implements GetCargoEmpleadoUseCase {
    constructor(private readonly repository: CargoEmpleadoRepository) {}

    execute(page?: number, limit?: number, departamentoid?: number): Promise<PaginatedResult<CargoEmpleadoEntity>> {
        return this.repository.getAll(page, limit, departamentoid);
    }
}
