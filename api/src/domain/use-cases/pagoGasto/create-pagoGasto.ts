import { PagoGastoEntity } from "../../entitites/pagoGasto.entity";
import { CreatePagoGastoDto } from "../../dtos";
import { PagoGastoRepository } from "../../repositories/pagoGasto.repository";

export interface CreatePagoGastoUseCase {
    execute(dto: CreatePagoGastoDto): Promise<PagoGastoEntity>;
}

export class CreatePagoGasto implements CreatePagoGastoUseCase {
    constructor(private readonly repository: PagoGastoRepository) { }
    execute(dto: CreatePagoGastoDto): Promise<PagoGastoEntity> {
        return this.repository.create(dto);
    }
}
