import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateMovimientoVentaDto,
    MovimientoVentaDatasource,
    MovimientoVentaEntity,
    MovimientoVentaRepository,
} from "../../domain";


export class MovimientoVentaRepositoryImpl implements MovimientoVentaRepository {

    constructor(private readonly datasource: MovimientoVentaDatasource) { }

    create(dto: CreateMovimientoVentaDto): Promise<MovimientoVentaEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<MovimientoVentaEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getByMovimientoId(movimeintoventaid: number): Promise<MovimientoVentaEntity[]> {
        return this.datasource.getByMovimientoId(movimeintoventaid);
    }

    getByVentaId(ventaid: number): Promise<MovimientoVentaEntity[]> {
        return this.datasource.getByVentaId(ventaid);
    }

    delete(movimeintoventaid: number, ventaid: number): Promise<MovimientoVentaEntity> {
        return this.datasource.delete(movimeintoventaid, ventaid);
    }

}
