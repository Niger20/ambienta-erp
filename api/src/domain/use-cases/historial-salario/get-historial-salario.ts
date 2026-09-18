import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { HistorialSalarioEntity } from "../../entitites/historial-salario.entity";
import { HistorialSalarioRepository } from "../../repositories/historial-salario.repository";

export interface GetHistorialSalarioUseCase {
    execute(page?: number, limit?: number, empleadoid?: number): Promise<PaginatedResult<HistorialSalarioEntity>>;
}

export class GetHistorialSalario implements GetHistorialSalarioUseCase {
    constructor(private readonly repository: HistorialSalarioRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number): Promise<PaginatedResult<HistorialSalarioEntity>> {
        return this.repository.getAll(page, limit, empleadoid);
    }
}
