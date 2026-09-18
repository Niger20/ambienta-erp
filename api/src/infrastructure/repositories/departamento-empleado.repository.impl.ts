import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateDepartamentoEmpleadoDto } from "../../domain/dtos/departamento-empleado/create-departamento-empleado.dto";
import { UpdateDepartamentoEmpleadoDto } from "../../domain/dtos/departamento-empleado/update-departamento-empleado.dto";
import { DepartamentoEmpleadoDatasource } from "../../domain/datasources/departamento-empleado.datasource";
import { DepartamentoEmpleadoEntity } from "../../domain/entitites/departamento-empleado.entity";
import { DepartamentoEmpleadoRepository } from "../../domain/repositories/departamento-empleado.repository";

export class DepartamentoEmpleadoRepositoryImpl implements DepartamentoEmpleadoRepository {
    constructor(private readonly datasource: DepartamentoEmpleadoDatasource) {}

    create(dto: CreateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<DepartamentoEmpleadoEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<DepartamentoEmpleadoEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateDepartamentoEmpleadoDto): Promise<DepartamentoEmpleadoEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<DepartamentoEmpleadoEntity> {
        return this.datasource.delete(id);
    }
}
