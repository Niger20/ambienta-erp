import { UpdateOrdenCompraProductoDto } from "../../dtos/orden-compra-producto/update-orden-compra-producto.dto";
import { OrdenCompraProductoEntity } from "../../entitites/orden-compra-producto.entity";
import { OrdenCompraProductoRepository } from "../../repositories/orden-compra-producto.repository";

export interface UpdateOrdenCompraProductoUseCase {
    execute(dto: UpdateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity | null>;
}

export class UpdateOrdenCompraProducto implements UpdateOrdenCompraProductoUseCase {
    constructor(private readonly repository: OrdenCompraProductoRepository) {}

    execute(dto: UpdateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity | null> {
        return this.repository.update(dto);
    }
}
