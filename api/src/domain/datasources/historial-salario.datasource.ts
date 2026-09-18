import { CreateHistorialSalarioDto } from "../dtos/historial-salario/create-historial-salario.dto";
import { UpdateHistorialSalarioDto } from "../dtos/historial-salario/update-historial-salario.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { HistorialSalarioEntity } from "../entitites/historial-salario.entity";

export abstract class HistorialSalarioDatasource {
    abstract create(dto: CreateHistorialSalarioDto): Promise<HistorialSalarioEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number): Promise<PaginatedResult<HistorialSalarioEntity>>;
    abstract getById(id: number): Promise<HistorialSalarioEntity | null>;
    abstract update(dto: UpdateHistorialSalarioDto): Promise<HistorialSalarioEntity | null>;
    abstract delete(id: number): Promise<HistorialSalarioEntity>;
}
