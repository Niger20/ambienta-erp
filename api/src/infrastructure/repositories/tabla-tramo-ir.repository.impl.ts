import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateTablaTramoIrDto } from "../../domain/dtos/tabla-tramo-ir/create-tabla-tramo-ir.dto";
import { UpdateTablaTramoIrDto } from "../../domain/dtos/tabla-tramo-ir/update-tabla-tramo-ir.dto";
import { TablaTramoIrDatasource } from "../../domain/datasources/tabla-tramo-ir.datasource";
import { TablaTramoIrEntity } from "../../domain/entitites/tabla-tramo-ir.entity";
import { TablaTramoIrRepository } from "../../domain/repositories/tabla-tramo-ir.repository";

export class TablaTramoIrRepositoryImpl implements TablaTramoIrRepository {
    constructor(private readonly datasource: TablaTramoIrDatasource) {}

    create(dto: CreateTablaTramoIrDto): Promise<TablaTramoIrEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<TablaTramoIrEntity>> {
        return this.datasource.getAll(page, limit, activo);
    }

    getById(id: number): Promise<TablaTramoIrEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateTablaTramoIrDto): Promise<TablaTramoIrEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<TablaTramoIrEntity> {
        return this.datasource.delete(id);
    }
}
