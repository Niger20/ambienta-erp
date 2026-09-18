import { PagoGastoEntity } from "../../entitites/pagoGasto.entity";
import { PagoGastoRepository } from "../../repositories/pagoGasto.repository";

export interface GetByGastoIdPagoGastoUseCase {
    execute(gastoid: number): Promise<PagoGastoEntity[]>;
}

export class GetByGastoIdPagoGasto implements GetByGastoIdPagoGastoUseCase {
    constructor(private readonly repository: PagoGastoRepository) { }
    execute(gastoid: number): Promise<PagoGastoEntity[]> {
        return this.repository.getByGastoId(gastoid);
    }
}
