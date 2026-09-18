import { CreateCostoAdicionalCompraDto } from "../../dtos/costo-adicional-compra/create-costo-adicional-compra.dto";
import { CostoAdicionalCompraEntity } from "../../entitites/costo-adicional-compra.entity";
import { CostoAdicionalCompraRepository } from "../../repositories/costo-adicional-compra.repository";

export interface CreateCostoAdicionalCompraUseCase {
    execute(dto: CreateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity>;
}

export class CreateCostoAdicionalCompra implements CreateCostoAdicionalCompraUseCase {
    constructor(private readonly repository: CostoAdicionalCompraRepository) {}

    execute(dto: CreateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity> {
        return this.repository.create(dto);
    }
}
