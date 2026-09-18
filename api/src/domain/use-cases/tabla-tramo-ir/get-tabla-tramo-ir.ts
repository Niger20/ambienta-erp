import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { TablaTramoIrEntity } from "../../entitites/tabla-tramo-ir.entity";
import { TablaTramoIrRepository } from "../../repositories/tabla-tramo-ir.repository";

export interface GetTablaTramoIrUseCase {
    execute(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<TablaTramoIrEntity>>;
}

export class GetTablaTramoIr implements GetTablaTramoIrUseCase {
    constructor(private readonly repository: TablaTramoIrRepository) {}

    execute(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<TablaTramoIrEntity>> {
        return this.repository.getAll(page, limit, activo);
    }
}
