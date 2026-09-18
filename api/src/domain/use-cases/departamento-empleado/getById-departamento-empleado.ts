import { DepartamentoEmpleadoEntity } from "../../entitites/departamento-empleado.entity";
import { DepartamentoEmpleadoRepository } from "../../repositories/departamento-empleado.repository";

export interface GetByIdDepartamentoEmpleadoUseCase {
    execute(id: number): Promise<DepartamentoEmpleadoEntity | null>;
}

export class GetByIdDepartamentoEmpleado implements GetByIdDepartamentoEmpleadoUseCase {
    constructor(private readonly repository: DepartamentoEmpleadoRepository) {}

    execute(id: number): Promise<DepartamentoEmpleadoEntity | null> {
        return this.repository.getById(id);
    }
}
