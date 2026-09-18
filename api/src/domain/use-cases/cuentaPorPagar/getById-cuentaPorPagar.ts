import { CuentaPorPagarEntity } from "../../entitites/cuentaPorPagar.entity";
import { CuentaPorPagarRepository } from "../../repositories/cuentaPorPagar.repository";

export interface GetByIdCuentaPorPagarUseCase {
    execute(id: number): Promise<CuentaPorPagarEntity | null>;
}

export class GetByIdCuentaPorPagar implements GetByIdCuentaPorPagarUseCase {
    constructor(private readonly repository: CuentaPorPagarRepository) { }
    execute(id: number): Promise<CuentaPorPagarEntity | null> {
        return this.repository.getById(id);
    }
}
