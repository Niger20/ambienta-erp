import { EmpleadoEntity } from "../../entitites/empleado.entity";
import { EmpleadoRepository } from "../../repositories/empleado.repository";

export interface DeleteEmpleadoUseCase {
    execute(id: number): Promise<EmpleadoEntity>;
}

export class DeleteEmpleado implements DeleteEmpleadoUseCase {
    constructor(private readonly repository: EmpleadoRepository) {}

    execute(id: number): Promise<EmpleadoEntity> {
        return this.repository.delete(id);
    }
}
