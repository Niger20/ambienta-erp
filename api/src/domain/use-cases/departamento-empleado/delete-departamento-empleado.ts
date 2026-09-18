import { DepartamentoEmpleadoEntity } from "../../entitites/departamento-empleado.entity";
import { DepartamentoEmpleadoRepository } from "../../repositories/departamento-empleado.repository";

export interface DeleteDepartamentoEmpleadoUseCase {
    execute(id: number): Promise<DepartamentoEmpleadoEntity>;
}

export class DeleteDepartamentoEmpleado implements DeleteDepartamentoEmpleadoUseCase {
    constructor(private readonly repository: DepartamentoEmpleadoRepository) {}

    execute(id: number): Promise<DepartamentoEmpleadoEntity> {
        return this.repository.delete(id);
    }
}
