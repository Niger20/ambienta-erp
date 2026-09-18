import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateCargoEmpleadoDto } from "../../domain/dtos/cargo-empleado/create-cargo-empleado.dto";
import { UpdateCargoEmpleadoDto } from "../../domain/dtos/cargo-empleado/update-cargo-empleado.dto";
import { CargoEmpleadoDatasource } from "../../domain/datasources/cargo-empleado.datasource";
import { CargoEmpleadoEntity } from "../../domain/entitites/cargo-empleado.entity";
import { CargoEmpleadoRepository } from "../../domain/repositories/cargo-empleado.repository";

export class CargoEmpleadoRepositoryImpl implements CargoEmpleadoRepository {
    constructor(private readonly datasource: CargoEmpleadoDatasource) {}

    create(dto: CreateCargoEmpleadoDto): Promise<CargoEmpleadoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, departamentoid?: number): Promise<PaginatedResult<CargoEmpleadoEntity>> {
        return this.datasource.getAll(page, limit, departamentoid);
    }

    getById(id: number): Promise<CargoEmpleadoEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateCargoEmpleadoDto): Promise<CargoEmpleadoEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<CargoEmpleadoEntity> {
        return this.datasource.delete(id);
    }
}
