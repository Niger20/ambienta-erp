import { PagoCuentaPorPagarEntity } from "../../entitites/pagoCuentaPorPagar.entity";
import { PagoCuentaPorPagarRepository } from "../../repositories/pagoCuentaPorPagar.repository";

export interface GetByPagoIdPagoCuentaPorPagarUseCase {
    execute(pagoid: number): Promise<PagoCuentaPorPagarEntity[]>;
}

export class GetByPagoIdPagoCuentaPorPagar implements GetByPagoIdPagoCuentaPorPagarUseCase {
    constructor(private readonly repository: PagoCuentaPorPagarRepository) { }
    execute(pagoid: number): Promise<PagoCuentaPorPagarEntity[]> {
        return this.repository.getByPagoId(pagoid);
    }
}
