import { UpdateCostoAdicionalCompraDto } from "../../dtos/costo-adicional-compra/update-costo-adicional-compra.dto";
import { CostoAdicionalCompraEntity } from "../../entitites/costo-adicional-compra.entity";
import { CostoAdicionalCompraRepository } from "../../repositories/costo-adicional-compra.repository";

export interface UpdateCostoAdicionalCompraUseCase {
    execute(dto: UpdateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity | null>;
}

export class UpdateCostoAdicionalCompra implements UpdateCostoAdicionalCompraUseCase {
    constructor(private readonly repository: CostoAdicionalCompraRepository) {}

    execute(dto: UpdateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity | null> {
        return this.repository.update(dto);
    }
}
