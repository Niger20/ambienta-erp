import { CostoAdicionalCompraEntity } from "../../entitites/costo-adicional-compra.entity";
import { CostoAdicionalCompraRepository } from "../../repositories/costo-adicional-compra.repository";

export interface GetByIdCostoAdicionalCompraUseCase {
    execute(id: number): Promise<CostoAdicionalCompraEntity | null>;
}

export class GetByIdCostoAdicionalCompra implements GetByIdCostoAdicionalCompraUseCase {
    constructor(private readonly repository: CostoAdicionalCompraRepository) {}

    execute(id: number): Promise<CostoAdicionalCompraEntity | null> {
        return this.repository.getById(id);
    }
}
