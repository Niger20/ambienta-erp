import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateDevolucionDto } from "../../domain/dtos/devolucion/create-devolucion.dto";
import { UpdateDevolucionDto } from "../../domain/dtos/devolucion/update-devolucion.dto";
import { DevolucionDatasource } from "../../domain/datasources/devolucion.datasource";
import { DevolucionEntity } from "../../domain/entitites/devolucion.entity";
import { DevolucionRepository } from "../../domain/repositories/devolucion.repository";

export class DevolucionRepositoryImpl implements DevolucionRepository {
    constructor(private readonly datasource: DevolucionDatasource) {}

    create(dto: CreateDevolucionDto): Promise<DevolucionEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, ventaid?: number, productoid?: number): Promise<PaginatedResult<DevolucionEntity>> {
        return this.datasource.getAll(page, limit, ventaid, productoid);
    }

    getById(id: number): Promise<DevolucionEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateDevolucionDto): Promise<DevolucionEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<DevolucionEntity> {
        return this.datasource.delete(id);
    }
}
