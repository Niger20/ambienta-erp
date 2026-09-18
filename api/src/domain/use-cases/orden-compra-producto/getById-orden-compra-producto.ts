import { OrdenCompraProductoEntity } from "../../entitites/orden-compra-producto.entity";
import { OrdenCompraProductoRepository } from "../../repositories/orden-compra-producto.repository";

export interface GetByIdOrdenCompraProductoUseCase {
    execute(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity | null>;
}

export class GetByIdOrdenCompraProducto implements GetByIdOrdenCompraProductoUseCase {
    constructor(private readonly repository: OrdenCompraProductoRepository) {}

    execute(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity | null> {
        return this.repository.getById(ordencompraid, productoid);
    }
}
