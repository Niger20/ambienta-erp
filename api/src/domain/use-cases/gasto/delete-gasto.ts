import { GastoEntity } from "../../entitites/gasto.entity";
import { GastoRepository } from "../../repositories/gasto.repository";


export interface DeleteGastoUseCase {
    execute(id: number): Promise<GastoEntity>;
}

export class DeleteGasto implements DeleteGastoUseCase {

    constructor(private readonly repository: GastoRepository) { }

    execute(id: number): Promise<GastoEntity> {
        return this.repository.delete(id);
    }

}
