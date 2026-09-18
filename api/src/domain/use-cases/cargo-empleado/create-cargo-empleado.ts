import { CreateCargoEmpleadoDto } from "../../dtos/cargo-empleado/create-cargo-empleado.dto";
import { CargoEmpleadoEntity } from "../../entitites/cargo-empleado.entity";
import { CargoEmpleadoRepository } from "../../repositories/cargo-empleado.repository";

export interface CreateCargoEmpleadoUseCase {
    execute(dto: CreateCargoEmpleadoDto): Promise<CargoEmpleadoEntity>;
}

export class CreateCargoEmpleado implements CreateCargoEmpleadoUseCase {
    constructor(private readonly repository: CargoEmpleadoRepository) {}

    execute(dto: CreateCargoEmpleadoDto): Promise<CargoEmpleadoEntity> {
        return this.repository.create(dto);
    }
}
