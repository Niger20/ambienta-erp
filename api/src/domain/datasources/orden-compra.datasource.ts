import { CreateOrdenCompraDto } from "../dtos/orden-compra/create-orden-compra.dto";
import { UpdateOrdenCompraDto } from "../dtos/orden-compra/update-orden-compra.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { OrdenCompraEntity } from "../entitites/orden-compra.entity";

export abstract class OrdenCompraDatasource {
    abstract create(dto: CreateOrdenCompraDto): Promise<OrdenCompraEntity>;
    abstract getAll(page?: number, limit?: number, proveedorid?: number, estado?: string): Promise<PaginatedResult<OrdenCompraEntity>>;
    abstract getById(id: number): Promise<OrdenCompraEntity | null>;
    abstract update(dto: UpdateOrdenCompraDto): Promise<OrdenCompraEntity | null>;
    abstract delete(id: number): Promise<OrdenCompraEntity>;
}
