import { OrdenCompraProductoEntity } from "../../entitites/orden-compra-producto.entity";
import { OrdenCompraProductoRepository } from "../../repositories/orden-compra-producto.repository";

export interface DeleteOrdenCompraProductoUseCase {
    execute(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity>;
}

export class DeleteOrdenCompraProducto implements DeleteOrdenCompraProductoUseCase {
    constructor(private readonly repository: OrdenCompraProductoRepository) {}

    execute(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity> {
        return this.repository.delete(ordencompraid, productoid);
    }
}
