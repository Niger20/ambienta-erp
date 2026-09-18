import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { MovimientoCompraEntity } from "../entitites/movimientoCompra.entity";
import { CreateMovimientoCompraDto } from "../dtos";

export abstract class MovimientoCompraDatasource {
    abstract create(dto: CreateMovimientoCompraDto): Promise<MovimientoCompraEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<MovimientoCompraEntity>>;
    abstract getByMovimientoId(movimientocompraid: number): Promise<MovimientoCompraEntity[]>;
    abstract getByCompraId(compraid: number): Promise<MovimientoCompraEntity[]>;
    abstract delete(movimientocompraid: number, compraid: number): Promise<MovimientoCompraEntity>;
}
