import { UpdateDepartamentoEmpleadoDto } from "../../dtos/departamento-empleado/update-departamento-empleado.dto";
import { DepartamentoEmpleadoEntity } from "../../entitites/departamento-empleado.entity";
import { DepartamentoEmpleadoRepository } from "../../repositories/departamento-empleado.repository";

export interface UpdateDepartamentoEmpleadoUseCase {
    execute(dto: UpdateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity | null>;
}

export class UpdateDepartamentoEmpleado implements UpdateDepartamentoEmpleadoUseCase {
    constructor(private readonly repository: DepartamentoEmpleadoRepository) {}

    execute(dto: UpdateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity | null> {
        return this.repository.update(dto);
    }
}
