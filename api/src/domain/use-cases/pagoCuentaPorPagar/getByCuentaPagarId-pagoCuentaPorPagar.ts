import { PagoCuentaPorPagarEntity } from "../../entitites/pagoCuentaPorPagar.entity";
import { PagoCuentaPorPagarRepository } from "../../repositories/pagoCuentaPorPagar.repository";

export interface GetByCuentaPagarIdPagoCuentaPorPagarUseCase {
    execute(cuentapagarid: number): Promise<PagoCuentaPorPagarEntity[]>;
}

export class GetByCuentaPagarIdPagoCuentaPorPagar implements GetByCuentaPagarIdPagoCuentaPorPagarUseCase {
    constructor(private readonly repository: PagoCuentaPorPagarRepository) { }
    execute(cuentapagarid: number): Promise<PagoCuentaPorPagarEntity[]> {
        return this.repository.getByCuentaPagarId(cuentapagarid);
    }
}
