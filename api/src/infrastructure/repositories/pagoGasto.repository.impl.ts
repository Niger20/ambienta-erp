import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreatePagoGastoDto,
    PagoGastoDatasource,
    PagoGastoEntity,
    PagoGastoRepository,
} from "../../domain";


export class PagoGastoRepositoryImpl implements PagoGastoRepository {

    constructor(private readonly datasource: PagoGastoDatasource) { }

    create(dto: CreatePagoGastoDto): Promise<PagoGastoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<PagoGastoEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getByPagoId(pagoid: number): Promise<PagoGastoEntity[]> {
        return this.datasource.getByPagoId(pagoid);
    }

    getByGastoId(gastoid: number): Promise<PagoGastoEntity[]> {
        return this.datasource.getByGastoId(gastoid);
    }

    delete(pagoid: number, gastoid: number): Promise<PagoGastoEntity> {
        return this.datasource.delete(pagoid, gastoid);
    }

}
