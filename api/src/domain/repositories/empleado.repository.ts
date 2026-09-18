import { CreateEmpleadoDto } from "../dtos/empleado/create-empleado.dto";
import { UpdateEmpleadoDto } from "../dtos/empleado/update-empleado.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { EmpleadoEntity } from "../entitites/empleado.entity";

export abstract class EmpleadoRepository {
    abstract create(dto: CreateEmpleadoDto): Promise<EmpleadoEntity>;
    abstract getAll(page?: number, limit?: number, cargoid?: number, estado?: boolean): Promise<PaginatedResult<EmpleadoEntity>>;
    abstract getById(id: number): Promise<EmpleadoEntity | null>;
    abstract getDeactivated(): Promise<EmpleadoEntity[]>;
    abstract update(dto: UpdateEmpleadoDto): Promise<EmpleadoEntity | null>;
    abstract delete(id: number): Promise<EmpleadoEntity>;
}
