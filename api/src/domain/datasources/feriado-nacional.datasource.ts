import { CreateFeriadoNacionalDto } from "../dtos/feriado-nacional/create-feriado-nacional.dto";
import { UpdateFeriadoNacionalDto } from "../dtos/feriado-nacional/update-feriado-nacional.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { FeriadoNacionalEntity } from "../entitites/feriado-nacional.entity";

export abstract class FeriadoNacionalDatasource {
    abstract create(dto: CreateFeriadoNacionalDto): Promise<FeriadoNacionalEntity>;
    abstract getAll(page?: number, limit?: number, anio?: number): Promise<PaginatedResult<FeriadoNacionalEntity>>;
    abstract getById(id: number): Promise<FeriadoNacionalEntity | null>;
    abstract update(dto: UpdateFeriadoNacionalDto): Promise<FeriadoNacionalEntity | null>;
    abstract delete(id: number): Promise<FeriadoNacionalEntity>;
}
