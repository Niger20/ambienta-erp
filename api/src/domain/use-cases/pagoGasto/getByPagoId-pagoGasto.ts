import { PagoGastoEntity } from "../../entitites/pagoGasto.entity";
import { PagoGastoRepository } from "../../repositories/pagoGasto.repository";

export interface GetByPagoIdPagoGastoUseCase {
    execute(pagoid: number): Promise<PagoGastoEntity[]>;
}

export class GetByPagoIdPagoGasto implements GetByPagoIdPagoGastoUseCase {
    constructor(private readonly repository: PagoGastoRepository) { }
    execute(pagoid: number): Promise<PagoGastoEntity[]> {
        return this.repository.getByPagoId(pagoid);
    }
}
