import { CuentaPorPagarEntity } from "../../entitites/cuentaPorPagar.entity";
import { UpdateCuentaPorPagarDto } from "../../dtos";
import { CuentaPorPagarRepository } from "../../repositories/cuentaPorPagar.repository";

export interface UpdateCuentaPorPagarUseCase {
    execute(dto: UpdateCuentaPorPagarDto): Promise<CuentaPorPagarEntity>;
}

export class UpdateCuentaPorPagar implements UpdateCuentaPorPagarUseCase {
    constructor(private readonly repository: CuentaPorPagarRepository) { }
    execute(dto: UpdateCuentaPorPagarDto): Promise<CuentaPorPagarEntity> {
        return this.repository.update(dto);
    }
}
