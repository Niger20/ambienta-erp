import { OrdenCompraEntity } from "../../entitites/orden-compra.entity";
import { OrdenCompraRepository } from "../../repositories/orden-compra.repository";

export interface DeleteOrdenCompraUseCase {
    execute(id: number): Promise<OrdenCompraEntity>;
}

export class DeleteOrdenCompra implements DeleteOrdenCompraUseCase {
    constructor(private readonly repository: OrdenCompraRepository) {}

    execute(id: number): Promise<OrdenCompraEntity> {
        return this.repository.delete(id);
    }
}
