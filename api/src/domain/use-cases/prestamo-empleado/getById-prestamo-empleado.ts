import { PrestamoEmpleadoEntity } from "../../entitites/prestamo-empleado.entity";
import { PrestamoEmpleadoRepository } from "../../repositories/prestamo-empleado.repository";

export interface GetByIdPrestamoEmpleadoUseCase {
    execute(id: number): Promise<PrestamoEmpleadoEntity | null>;
}

export class GetByIdPrestamoEmpleado implements GetByIdPrestamoEmpleadoUseCase {
    constructor(private readonly repository: PrestamoEmpleadoRepository) {}

    execute(id: number): Promise<PrestamoEmpleadoEntity | null> {
        return this.repository.getById(id);
    }
}
