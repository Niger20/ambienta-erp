import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { MovimientoVentaEntity } from "../entitites/movimientoVenta.entity";
import { CreateMovimientoVentaDto } from "../dtos";

export abstract class MovimientoVentaRepository {
    abstract create(dto: CreateMovimientoVentaDto): Promise<MovimientoVentaEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<MovimientoVentaEntity>>;
    abstract getByMovimientoId(movimeintoventaid: number): Promise<MovimientoVentaEntity[]>;
    abstract getByVentaId(ventaid: number): Promise<MovimientoVentaEntity[]>;
    abstract delete(movimeintoventaid: number, ventaid: number): Promise<MovimientoVentaEntity>;
}
