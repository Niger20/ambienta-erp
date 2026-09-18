import { CreateOrdenCompraProductoDto } from "../../dtos/orden-compra-producto/create-orden-compra-producto.dto";
import { OrdenCompraProductoEntity } from "../../entitites/orden-compra-producto.entity";
import { OrdenCompraProductoRepository } from "../../repositories/orden-compra-producto.repository";

export interface CreateOrdenCompraProductoUseCase {
    execute(dto: CreateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity>;
}

export class CreateOrdenCompraProducto implements CreateOrdenCompraProductoUseCase {
    constructor(private readonly repository: OrdenCompraProductoRepository) {}

    execute(dto: CreateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity> {
        return this.repository.create(dto);
    }
}
