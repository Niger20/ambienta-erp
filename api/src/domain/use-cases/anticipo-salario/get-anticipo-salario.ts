import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { AnticipoSalarioEntity } from "../../entitites/anticipo-salario.entity";
import { AnticipoSalarioRepository } from "../../repositories/anticipo-salario.repository";

export interface GetAnticipoSalarioUseCase {
    execute(page?: number, limit?: number, empleadoid?: number, mes?: number, anio?: number, estado?: string): Promise<PaginatedResult<AnticipoSalarioEntity>>;
}

export class GetAnticipoSalario implements GetAnticipoSalarioUseCase {
    constructor(private readonly repository: AnticipoSalarioRepository) {}

    execute(page?: number, limit?: number, empleadoid?: number, mes?: number, anio?: number, estado?: string): Promise<PaginatedResult<AnticipoSalarioEntity>> {
        return this.repository.getAll(page, limit, empleadoid, mes, anio, estado);
    }
}
