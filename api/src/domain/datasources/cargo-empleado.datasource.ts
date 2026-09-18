import { CreateCargoEmpleadoDto } from "../dtos/cargo-empleado/create-cargo-empleado.dto";
import { UpdateCargoEmpleadoDto } from "../dtos/cargo-empleado/update-cargo-empleado.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { CargoEmpleadoEntity } from "../entitites/cargo-empleado.entity";

export abstract class CargoEmpleadoDatasource {
    abstract create(dto: CreateCargoEmpleadoDto): Promise<CargoEmpleadoEntity>;
    abstract getAll(page?: number, limit?: number, departamentoid?: number): Promise<PaginatedResult<CargoEmpleadoEntity>>;
    abstract getById(id: number): Promise<CargoEmpleadoEntity | null>;
    abstract update(dto: UpdateCargoEmpleadoDto): Promise<CargoEmpleadoEntity | null>;
    abstract delete(id: number): Promise<CargoEmpleadoEntity>;
}
