import { EmpleadoEntity } from "../../entitites/empleado.entity";
import { EmpleadoRepository } from "../../repositories/empleado.repository";

export interface GetDeactivatedEmpleadoUseCase {
    execute(): Promise<EmpleadoEntity[]>;
}

export class GetDeactivatedEmpleado implements GetDeactivatedEmpleadoUseCase {
    constructor(private readonly repository: EmpleadoRepository) {}

    execute(): Promise<EmpleadoEntity[]> {
        return this.repository.getDeactivated();
    }
}
