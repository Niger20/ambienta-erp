import { CreateUnidadMedidaDto } from "../dtos/unidad-medida/create-unidad-medida.dto";
import { UpdateUnidadMedidaDto } from "../dtos/unidad-medida/update-unidad-medida.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { UnidadMedidaEntity } from "../entitites/unidad-medida.entity";

export abstract class UnidadMedidaDatasource {
    abstract create(dto: CreateUnidadMedidaDto): Promise<UnidadMedidaEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<UnidadMedidaEntity>>;
    abstract getById(id: number): Promise<UnidadMedidaEntity | null>;
    abstract update(dto: UpdateUnidadMedidaDto): Promise<UnidadMedidaEntity | null>;
    abstract delete(id: number): Promise<UnidadMedidaEntity>;
}
