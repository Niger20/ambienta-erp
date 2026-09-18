import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateGastoDto,
    GastoDatasource,
    GastoEntity,
    GastoRepository,
    UpdateGastoDto
} from "../../domain";


export class GastoRepositoryImpl implements GastoRepository {

    constructor(private readonly datasource: GastoDatasource) { }

    create(dto: CreateGastoDto): Promise<GastoEntity> {
        return this.datasource.create(dto);
    }

    delete(id: number): Promise<GastoEntity> {
        return this.datasource.delete(id);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<GastoEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<GastoEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateGastoDto): Promise<GastoEntity | null> {
        return this.datasource.update(dto);
    }

}
