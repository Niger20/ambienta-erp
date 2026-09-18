import { GastoEntity } from "../../entitites/gasto.entity";
import { CreateGastoDto } from "../../dtos";
import { GastoRepository } from "../../repositories/gasto.repository";


export interface CreateGastoUseCase {
    execute(dto: CreateGastoDto): Promise<GastoEntity>;
}

export class CreateGasto implements CreateGastoUseCase {

    constructor(private readonly repository: GastoRepository) { }

    execute(dto: CreateGastoDto): Promise<GastoEntity> {
        return this.repository.create(dto);
    }

}
