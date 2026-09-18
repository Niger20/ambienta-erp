import { UpdatePrestamoEmpleadoDto } from "../../dtos/prestamo-empleado/update-prestamo-empleado.dto";
import { PrestamoEmpleadoEntity } from "../../entitites/prestamo-empleado.entity";
import { PrestamoEmpleadoRepository } from "../../repositories/prestamo-empleado.repository";

export interface UpdatePrestamoEmpleadoUseCase {
    execute(dto: UpdatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity | null>;
}

export class UpdatePrestamoEmpleado implements UpdatePrestamoEmpleadoUseCase {
    constructor(private readonly repository: PrestamoEmpleadoRepository) {}

    execute(dto: UpdatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity | null> {
        return this.repository.update(dto);
    }
}
