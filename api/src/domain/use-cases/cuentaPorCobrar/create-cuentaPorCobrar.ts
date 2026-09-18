import { CuentaPorCobrarEntity } from "../../entitites/cuentaPorCobrar.entity";
import { CreateCuentaPorCobrarDto } from "../../dtos";
import { CuentaPorCobrarRepository } from "../../repositories/cuentaPorCobrar.repository";

export interface CreateCuentaPorCobrarUseCase {
    execute(dto: CreateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity>;
}

export class CreateCuentaPorCobrar implements CreateCuentaPorCobrarUseCase {
    constructor(private readonly repository: CuentaPorCobrarRepository) { }
    execute(dto: CreateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity> {
        return this.repository.create(dto);
    }
}
