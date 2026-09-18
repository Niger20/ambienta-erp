import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateCuentaPorCobrarDto,
    CuentaPorCobrarDatasource,
    CuentaPorCobrarEntity,
    CuentaPorCobrarRepository,
    UpdateCuentaPorCobrarDto,
} from "../../domain";


export class CuentaPorCobrarRepositoryImpl implements CuentaPorCobrarRepository {

    constructor(private readonly datasource: CuentaPorCobrarDatasource) { }

    create(dto: CreateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<CuentaPorCobrarEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getDeactivated(): Promise<CuentaPorCobrarEntity[]> {
        return this.datasource.getDeactivated();
    }

    getById(id: number): Promise<CuentaPorCobrarEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<CuentaPorCobrarEntity> {
        return this.datasource.delete(id);
    }

}
