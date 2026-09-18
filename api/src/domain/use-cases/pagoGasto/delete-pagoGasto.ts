import { PagoGastoEntity } from "../../entitites/pagoGasto.entity";
import { PagoGastoRepository } from "../../repositories/pagoGasto.repository";

export interface DeletePagoGastoUseCase {
    execute(pagoid: number, gastoid: number): Promise<PagoGastoEntity>;
}

export class DeletePagoGasto implements DeletePagoGastoUseCase {
    constructor(private readonly repository: PagoGastoRepository) { }
    execute(pagoid: number, gastoid: number): Promise<PagoGastoEntity> {
        return this.repository.delete(pagoid, gastoid);
    }
}
