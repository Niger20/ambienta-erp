import { CostoAdicionalCompraEntity } from "../../entitites/costo-adicional-compra.entity";
import { CostoAdicionalCompraRepository } from "../../repositories/costo-adicional-compra.repository";

export interface DeleteCostoAdicionalCompraUseCase {
    execute(id: number): Promise<CostoAdicionalCompraEntity>;
}

export class DeleteCostoAdicionalCompra implements DeleteCostoAdicionalCompraUseCase {
    constructor(private readonly repository: CostoAdicionalCompraRepository) {}

    execute(id: number): Promise<CostoAdicionalCompraEntity> {
        return this.repository.delete(id);
    }
}
