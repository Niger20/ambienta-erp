import { CuentaPorCobrarEntity } from "../../entitites/cuentaPorCobrar.entity";
import { CuentaPorCobrarRepository } from "../../repositories/cuentaPorCobrar.repository";

export interface DeleteCuentaPorCobrarUseCase {
    execute(id: number): Promise<CuentaPorCobrarEntity>;
}

export class DeleteCuentaPorCobrar implements DeleteCuentaPorCobrarUseCase {
    constructor(private readonly repository: CuentaPorCobrarRepository) { }
    execute(id: number): Promise<CuentaPorCobrarEntity> {
        return this.repository.delete(id);
    }
}
