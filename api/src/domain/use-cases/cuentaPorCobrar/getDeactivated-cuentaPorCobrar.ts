import { CuentaPorCobrarEntity } from "../../entitites/cuentaPorCobrar.entity";
import { CuentaPorCobrarRepository } from "../../repositories/cuentaPorCobrar.repository";

export interface GetDeactivatedCuentaPorCobrarUseCase {
    execute(): Promise<CuentaPorCobrarEntity[]>;
}

export class GetDeactivatedCuentaPorCobrar implements GetDeactivatedCuentaPorCobrarUseCase {
    constructor(private readonly repository: CuentaPorCobrarRepository) { }
    execute(): Promise<CuentaPorCobrarEntity[]> {
        return this.repository.getDeactivated();
    }
}
