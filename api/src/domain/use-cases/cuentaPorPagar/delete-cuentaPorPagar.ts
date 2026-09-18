import { CuentaPorPagarEntity } from "../../entitites/cuentaPorPagar.entity";
import { CuentaPorPagarRepository } from "../../repositories/cuentaPorPagar.repository";

export interface DeleteCuentaPorPagarUseCase {
    execute(id: number): Promise<CuentaPorPagarEntity>;
}

export class DeleteCuentaPorPagar implements DeleteCuentaPorPagarUseCase {
    constructor(private readonly repository: CuentaPorPagarRepository) { }
    execute(id: number): Promise<CuentaPorPagarEntity> {
        return this.repository.delete(id);
    }
}
