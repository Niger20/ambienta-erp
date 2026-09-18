import { CuentaPorPagarEntity } from "../../entitites/cuentaPorPagar.entity";
import { CuentaPorPagarRepository } from "../../repositories/cuentaPorPagar.repository";

export interface GetDeactivatedCuentaPorPagarUseCase {
    execute(): Promise<CuentaPorPagarEntity[]>;
}

export class GetDeactivatedCuentaPorPagar implements GetDeactivatedCuentaPorPagarUseCase {
    constructor(private readonly repository: CuentaPorPagarRepository) { }
    execute(): Promise<CuentaPorPagarEntity[]> {
        return this.repository.getDeactivated();
    }
}
