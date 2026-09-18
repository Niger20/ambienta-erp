import { CreateDepartamentoEmpleadoDto } from "../dtos/departamento-empleado/create-departamento-empleado.dto";
import { UpdateDepartamentoEmpleadoDto } from "../dtos/departamento-empleado/update-departamento-empleado.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { DepartamentoEmpleadoEntity } from "../entitites/departamento-empleado.entity";

export abstract class DepartamentoEmpleadoRepository {
    abstract create(dto: CreateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<DepartamentoEmpleadoEntity>>;
    abstract getById(id: number): Promise<DepartamentoEmpleadoEntity | null>;
    abstract update(dto: UpdateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity | null>;
    abstract delete(id: number): Promise<DepartamentoEmpleadoEntity>;
}
