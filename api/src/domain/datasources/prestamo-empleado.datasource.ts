import { CreatePrestamoEmpleadoDto } from "../dtos/prestamo-empleado/create-prestamo-empleado.dto";
import { UpdatePrestamoEmpleadoDto } from "../dtos/prestamo-empleado/update-prestamo-empleado.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { PrestamoEmpleadoEntity } from "../entitites/prestamo-empleado.entity";

export abstract class PrestamoEmpleadoDatasource {
    abstract create(dto: CreatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<PrestamoEmpleadoEntity>>;
    abstract getById(id: number): Promise<PrestamoEmpleadoEntity | null>;
    abstract update(dto: UpdatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity | null>;
    abstract delete(id: number): Promise<PrestamoEmpleadoEntity>;
}
