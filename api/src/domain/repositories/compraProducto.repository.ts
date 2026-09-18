import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { CompraProductoEntity } from "../entitites/compraProducto.entity";
import { CreateCompraProductoDto } from "../dtos";

export abstract class CompraProductoRepository {
    abstract create(dto: CreateCompraProductoDto): Promise<CompraProductoEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<CompraProductoEntity>>;
    abstract getByCompraId(compraid: number): Promise<CompraProductoEntity[]>;
    abstract delete(compraid: number, productoid: number): Promise<CompraProductoEntity>;
}
