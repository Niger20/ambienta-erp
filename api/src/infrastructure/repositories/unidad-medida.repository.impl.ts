import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateUnidadMedidaDto } from "../../domain/dtos/unidad-medida/create-unidad-medida.dto";
import { UpdateUnidadMedidaDto } from "../../domain/dtos/unidad-medida/update-unidad-medida.dto";
import { UnidadMedidaDatasource } from "../../domain/datasources/unidad-medida.datasource";
import { UnidadMedidaEntity } from "../../domain/entitites/unidad-medida.entity";
import { UnidadMedidaRepository } from "../../domain/repositories/unidad-medida.repository";

export class UnidadMedidaRepositoryImpl implements UnidadMedidaRepository {
    constructor(private readonly datasource: UnidadMedidaDatasource) {}

    create(dto: CreateUnidadMedidaDto): Promise<UnidadMedidaEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<UnidadMedidaEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<UnidadMedidaEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateUnidadMedidaDto): Promise<UnidadMedidaEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<UnidadMedidaEntity> {
        return this.datasource.delete(id);
    }
}
