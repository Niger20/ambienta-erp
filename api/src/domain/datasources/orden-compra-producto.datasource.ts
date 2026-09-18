import { CreateOrdenCompraProductoDto } from "../dtos/orden-compra-producto/create-orden-compra-producto.dto";
import { UpdateOrdenCompraProductoDto } from "../dtos/orden-compra-producto/update-orden-compra-producto.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { OrdenCompraProductoEntity } from "../entitites/orden-compra-producto.entity";

export abstract class OrdenCompraProductoDatasource {
    abstract create(dto: CreateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity>;
    abstract getAll(page?: number, limit?: number, ordencompraid?: number): Promise<PaginatedResult<OrdenCompraProductoEntity>>;
    abstract getById(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity | null>;
    abstract update(dto: UpdateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity | null>;
    abstract delete(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity>;
}
