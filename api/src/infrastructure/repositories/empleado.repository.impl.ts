import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateEmpleadoDto } from "../../domain/dtos/empleado/create-empleado.dto";
import { UpdateEmpleadoDto } from "../../domain/dtos/empleado/update-empleado.dto";
import { EmpleadoDatasource } from "../../domain/datasources/empleado.datasource";
import { EmpleadoEntity } from "../../domain/entitites/empleado.entity";
import { EmpleadoRepository } from "../../domain/repositories/empleado.repository";

export class EmpleadoRepositoryImpl implements EmpleadoRepository {
    constructor(private readonly datasource: EmpleadoDatasource) {}

    create(dto: CreateEmpleadoDto): Promise<EmpleadoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, cargoid?: number, estado?: boolean): Promise<PaginatedResult<EmpleadoEntity>> {
        return this.datasource.getAll(page, limit, cargoid, estado);
    }

    getDeactivated(): Promise<EmpleadoEntity[]> {
        return this.datasource.getDeactivated();
    }

    getById(id: number): Promise<EmpleadoEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateEmpleadoDto): Promise<EmpleadoEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<EmpleadoEntity> {
        return this.datasource.delete(id);
    }
}
