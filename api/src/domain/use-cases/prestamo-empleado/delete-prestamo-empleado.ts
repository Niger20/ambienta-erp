import { PrestamoEmpleadoEntity } from "../../entitites/prestamo-empleado.entity";
import { PrestamoEmpleadoRepository } from "../../repositories/prestamo-empleado.repository";

export interface DeletePrestamoEmpleadoUseCase {
    execute(id: number): Promise<PrestamoEmpleadoEntity>;
}

export class DeletePrestamoEmpleado implements DeletePrestamoEmpleadoUseCase {
    constructor(private readonly repository: PrestamoEmpleadoRepository) {}

    execute(id: number): Promise<PrestamoEmpleadoEntity> {
        return this.repository.delete(id);
    }
}
