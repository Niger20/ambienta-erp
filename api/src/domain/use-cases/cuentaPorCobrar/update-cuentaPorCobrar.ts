import { CuentaPorCobrarEntity } from "../../entitites/cuentaPorCobrar.entity";
import { UpdateCuentaPorCobrarDto } from "../../dtos";
import { CuentaPorCobrarRepository } from "../../repositories/cuentaPorCobrar.repository";

export interface UpdateCuentaPorCobrarUseCase {
    execute(dto: UpdateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity>;
}

export class UpdateCuentaPorCobrar implements UpdateCuentaPorCobrarUseCase {
    constructor(private readonly repository: CuentaPorCobrarRepository) { }
    execute(dto: UpdateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity> {
        return this.repository.update(dto);
    }
}
