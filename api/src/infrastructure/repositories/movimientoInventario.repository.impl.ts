import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateMovimientoInventarioDto,
    MovimientoInventarioDatasource,
    MovimientoInventarioEntity,
    MovimientoInventarioRepository,
} from "../../domain";


export class MovimientoInventarioRepositoryImpl implements MovimientoInventarioRepository {

    constructor(private readonly datasource: MovimientoInventarioDatasource) { }

    create(dto: CreateMovimientoInventarioDto): Promise<MovimientoInventarioEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<MovimientoInventarioEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<MovimientoInventarioEntity | null> {
        return this.datasource.getById(id);
    }

    getByProductoId(productoid: number): Promise<MovimientoInventarioEntity[]> {
        return this.datasource.getByProductoId(productoid);
    }

    delete(id: number): Promise<MovimientoInventarioEntity> {
        return this.datasource.delete(id);
    }
}
