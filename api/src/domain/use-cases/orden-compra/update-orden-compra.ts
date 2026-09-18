import { UpdateOrdenCompraDto } from "../../dtos/orden-compra/update-orden-compra.dto";
import { OrdenCompraEntity } from "../../entitites/orden-compra.entity";
import { OrdenCompraRepository } from "../../repositories/orden-compra.repository";

export interface UpdateOrdenCompraUseCase {
    execute(dto: UpdateOrdenCompraDto): Promise<OrdenCompraEntity | null>;
}

export class UpdateOrdenCompra implements UpdateOrdenCompraUseCase {
    constructor(private readonly repository: OrdenCompraRepository) {}

    execute(dto: UpdateOrdenCompraDto): Promise<OrdenCompraEntity | null> {
        return this.repository.update(dto);
    }
}
