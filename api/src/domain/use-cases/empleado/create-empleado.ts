import { CreateEmpleadoDto } from "../../dtos/empleado/create-empleado.dto";
import { EmpleadoEntity } from "../../entitites/empleado.entity";
import { EmpleadoRepository } from "../../repositories/empleado.repository";

export interface CreateEmpleadoUseCase {
    execute(dto: CreateEmpleadoDto): Promise<EmpleadoEntity>;
}

export class CreateEmpleado implements CreateEmpleadoUseCase {
    constructor(private readonly repository: EmpleadoRepository) {}

    execute(dto: CreateEmpleadoDto): Promise<EmpleadoEntity> {
        return this.repository.create(dto);
    }
}
