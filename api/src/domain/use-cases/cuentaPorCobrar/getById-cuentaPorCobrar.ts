import { CuentaPorCobrarEntity } from "../../entitites/cuentaPorCobrar.entity";
import { CuentaPorCobrarRepository } from "../../repositories/cuentaPorCobrar.repository";

export interface GetByIdCuentaPorCobrarUseCase {
    execute(id: number): Promise<CuentaPorCobrarEntity | null>;
}

export class GetByIdCuentaPorCobrar implements GetByIdCuentaPorCobrarUseCase {
    constructor(private readonly repository: CuentaPorCobrarRepository) { }
    execute(id: number): Promise<CuentaPorCobrarEntity | null> {
        return this.repository.getById(id);
    }
}
