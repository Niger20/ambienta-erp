import { EmpleadoEntity } from "../../entitites/empleado.entity";
import { EmpleadoRepository } from "../../repositories/empleado.repository";

export interface GetByIdEmpleadoUseCase {
    execute(id: number): Promise<EmpleadoEntity | null>;
}

export class GetByIdEmpleado implements GetByIdEmpleadoUseCase {
    constructor(private readonly repository: EmpleadoRepository) {}

    execute(id: number): Promise<EmpleadoEntity | null> {
        return this.repository.getById(id);
    }
}
