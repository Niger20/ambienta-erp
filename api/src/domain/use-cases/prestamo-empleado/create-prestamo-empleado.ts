import { CreatePrestamoEmpleadoDto } from "../../dtos/prestamo-empleado/create-prestamo-empleado.dto";
import { PrestamoEmpleadoEntity } from "../../entitites/prestamo-empleado.entity";
import { PrestamoEmpleadoRepository } from "../../repositories/prestamo-empleado.repository";

export interface CreatePrestamoEmpleadoUseCase {
    execute(dto: CreatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity>;
}

export class CreatePrestamoEmpleado implements CreatePrestamoEmpleadoUseCase {
    constructor(private readonly repository: PrestamoEmpleadoRepository) {}

    execute(dto: CreatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity> {
        return this.repository.create(dto);
    }
}
