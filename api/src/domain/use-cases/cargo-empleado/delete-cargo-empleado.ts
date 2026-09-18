import { CargoEmpleadoEntity } from "../../entitites/cargo-empleado.entity";
import { CargoEmpleadoRepository } from "../../repositories/cargo-empleado.repository";

export interface DeleteCargoEmpleadoUseCase {
    execute(id: number): Promise<CargoEmpleadoEntity>;
}

export class DeleteCargoEmpleado implements DeleteCargoEmpleadoUseCase {
    constructor(private readonly repository: CargoEmpleadoRepository) {}

    execute(id: number): Promise<CargoEmpleadoEntity> {
        return this.repository.delete(id);
    }
}
