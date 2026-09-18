import { UpdateCargoEmpleadoDto } from "../../dtos/cargo-empleado/update-cargo-empleado.dto";
import { CargoEmpleadoEntity } from "../../entitites/cargo-empleado.entity";
import { CargoEmpleadoRepository } from "../../repositories/cargo-empleado.repository";

export interface UpdateCargoEmpleadoUseCase {
    execute(dto: UpdateCargoEmpleadoDto): Promise<CargoEmpleadoEntity | null>;
}

export class UpdateCargoEmpleado implements UpdateCargoEmpleadoUseCase {
    constructor(private readonly repository: CargoEmpleadoRepository) {}

    execute(dto: UpdateCargoEmpleadoDto): Promise<CargoEmpleadoEntity | null> {
        return this.repository.update(dto);
    }
}
