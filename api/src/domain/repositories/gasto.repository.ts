import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { GastoEntity } from "../entitites/gasto.entity";
import { CreateGastoDto, UpdateGastoDto } from "../dtos";


export abstract class GastoRepository {

    abstract create(dto: CreateGastoDto): Promise<GastoEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<GastoEntity>>;
    abstract getById(id: number): Promise<GastoEntity | null>;
    abstract update(dto: UpdateGastoDto): Promise<GastoEntity | null>;
    abstract delete(id: number): Promise<GastoEntity>;

}
