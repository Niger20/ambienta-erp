import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { MovimientoInventarioEntity } from "../entitites/movimientoInventario.entity";
import { CreateMovimientoInventarioDto } from "../dtos";

export abstract class MovimientoInventarioRepository {
    abstract create(dto: CreateMovimientoInventarioDto): Promise<MovimientoInventarioEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<MovimientoInventarioEntity>>;
    abstract getById(id: number): Promise<MovimientoInventarioEntity | null>;
    abstract getByProductoId(productoid: number): Promise<MovimientoInventarioEntity[]>;
    abstract delete(id: number): Promise<MovimientoInventarioEntity>;
}
