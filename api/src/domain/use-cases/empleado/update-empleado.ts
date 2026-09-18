import { UpdateEmpleadoDto } from "../../dtos/empleado/update-empleado.dto";
import { EmpleadoEntity } from "../../entitites/empleado.entity";
import { EmpleadoRepository } from "../../repositories/empleado.repository";

export interface UpdateEmpleadoUseCase {
    execute(dto: UpdateEmpleadoDto): Promise<EmpleadoEntity | null>;
}

export class UpdateEmpleado implements UpdateEmpleadoUseCase {
    constructor(private readonly repository: EmpleadoRepository) {}

    execute(dto: UpdateEmpleadoDto): Promise<EmpleadoEntity | null> {
        return this.repository.update(dto);
    }
}
