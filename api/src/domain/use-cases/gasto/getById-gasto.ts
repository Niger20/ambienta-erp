import { GastoEntity } from "../../entitites/gasto.entity";
import { GastoRepository } from "../../repositories/gasto.repository";


export interface GetByIdGastoUseCase {
    execute(id: number): Promise<GastoEntity | null>;
}

export class GetByIdGasto implements GetByIdGastoUseCase {

    constructor(private readonly repository: GastoRepository) { }

    execute(id: number): Promise<GastoEntity | null> {
        return this.repository.getById(id);
    }

}
