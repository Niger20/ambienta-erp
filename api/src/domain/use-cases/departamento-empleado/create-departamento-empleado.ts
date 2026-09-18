import { CreateDepartamentoEmpleadoDto } from "../../dtos/departamento-empleado/create-departamento-empleado.dto";
import { DepartamentoEmpleadoEntity } from "../../entitites/departamento-empleado.entity";
import { DepartamentoEmpleadoRepository } from "../../repositories/departamento-empleado.repository";

export interface CreateDepartamentoEmpleadoUseCase {
    execute(dto: CreateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity>;
}

export class CreateDepartamentoEmpleado implements CreateDepartamentoEmpleadoUseCase {
    constructor(private readonly repository: DepartamentoEmpleadoRepository) {}

    execute(dto: CreateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity> {
        return this.repository.create(dto);
    }
}
