import { CuentaPorPagarEntity } from "../../entitites/cuentaPorPagar.entity";
import { CreateCuentaPorPagarDto } from "../../dtos";
import { CuentaPorPagarRepository } from "../../repositories/cuentaPorPagar.repository";

export interface CreateCuentaPorPagarUseCase {
    execute(dto: CreateCuentaPorPagarDto): Promise<CuentaPorPagarEntity>;
}

export class CreateCuentaPorPagar implements CreateCuentaPorPagarUseCase {
    constructor(private readonly repository: CuentaPorPagarRepository) { }
    execute(dto: CreateCuentaPorPagarDto): Promise<CuentaPorPagarEntity> {
        return this.repository.create(dto);
    }
}
