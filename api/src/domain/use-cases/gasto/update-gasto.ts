import { GastoEntity } from "../../entitites/gasto.entity";
import { UpdateGastoDto } from "../../dtos";
import { GastoRepository } from "../../repositories/gasto.repository";


export interface UpdateGastoUseCase {
    execute(dto: UpdateGastoDto): Promise<GastoEntity | null>;
}

export class UpdateGasto implements UpdateGastoUseCase {

    constructor(private readonly repository: GastoRepository) { }

    execute(dto: UpdateGastoDto): Promise<GastoEntity | null> {
        return this.repository.update(dto);
    }

}
