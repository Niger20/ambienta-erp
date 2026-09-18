import { CargoEmpleadoEntity } from "../../entitites/cargo-empleado.entity";
import { CargoEmpleadoRepository } from "../../repositories/cargo-empleado.repository";

export interface GetByIdCargoEmpleadoUseCase {
    execute(id: number): Promise<CargoEmpleadoEntity | null>;
}

export class GetByIdCargoEmpleado implements GetByIdCargoEmpleadoUseCase {
    constructor(private readonly repository: CargoEmpleadoRepository) {}

    execute(id: number): Promise<CargoEmpleadoEntity | null> {
        return this.repository.getById(id);
    }
}
