import { CreateAnticipoSalarioDto } from "../dtos/anticipo-salario/create-anticipo-salario.dto";
import { UpdateAnticipoSalarioDto } from "../dtos/anticipo-salario/update-anticipo-salario.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { AnticipoSalarioEntity } from "../entitites/anticipo-salario.entity";

export abstract class AnticipoSalarioRepository {
    abstract create(dto: CreateAnticipoSalarioDto): Promise<AnticipoSalarioEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number, mes?: number, anio?: number, estado?: string): Promise<PaginatedResult<AnticipoSalarioEntity>>;
    abstract getById(id: number): Promise<AnticipoSalarioEntity | null>;
    abstract update(dto: UpdateAnticipoSalarioDto): Promise<AnticipoSalarioEntity | null>;
    abstract delete(id: number): Promise<AnticipoSalarioEntity>;
}
