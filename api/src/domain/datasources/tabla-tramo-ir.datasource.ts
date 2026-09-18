import { CreateTablaTramoIrDto } from "../dtos/tabla-tramo-ir/create-tabla-tramo-ir.dto";
import { UpdateTablaTramoIrDto } from "../dtos/tabla-tramo-ir/update-tabla-tramo-ir.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { TablaTramoIrEntity } from "../entitites/tabla-tramo-ir.entity";

export abstract class TablaTramoIrDatasource {
    abstract create(dto: CreateTablaTramoIrDto): Promise<TablaTramoIrEntity>;
    abstract getAll(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<TablaTramoIrEntity>>;
    abstract getById(id: number): Promise<TablaTramoIrEntity | null>;
    abstract update(dto: UpdateTablaTramoIrDto): Promise<TablaTramoIrEntity | null>;
    abstract delete(id: number): Promise<TablaTramoIrEntity>;
}
