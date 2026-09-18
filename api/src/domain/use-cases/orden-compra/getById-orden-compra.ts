import { OrdenCompraEntity } from "../../entitites/orden-compra.entity";
import { OrdenCompraRepository } from "../../repositories/orden-compra.repository";

export interface GetByIdOrdenCompraUseCase {
    execute(id: number): Promise<OrdenCompraEntity | null>;
}

export class GetByIdOrdenCompra implements GetByIdOrdenCompraUseCase {
    constructor(private readonly repository: OrdenCompraRepository) {}

    execute(id: number): Promise<OrdenCompraEntity | null> {
        return this.repository.getById(id);
    }
}
