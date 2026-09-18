import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateMovimientoCompraDto,
    MovimientoCompraDatasource,
    MovimientoCompraEntity,
    MovimientoCompraRepository,
} from "../../domain";


export class MovimientoCompraRepositoryImpl implements MovimientoCompraRepository {

    constructor(private readonly datasource: MovimientoCompraDatasource) { }

    create(dto: CreateMovimientoCompraDto): Promise<MovimientoCompraEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<MovimientoCompraEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getByMovimientoId(movimientocompraid: number): Promise<MovimientoCompraEntity[]> {
        return this.datasource.getByMovimientoId(movimientocompraid);
    }

    getByCompraId(compraid: number): Promise<MovimientoCompraEntity[]> {
        return this.datasource.getByCompraId(compraid);
    }

    delete(movimientocompraid: number, compraid: number): Promise<MovimientoCompraEntity> {
        return this.datasource.delete(movimientocompraid, compraid);
    }

}
