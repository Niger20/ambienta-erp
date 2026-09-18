import { PagoCuentaPorPagarEntity } from "../../entitites/pagoCuentaPorPagar.entity";
import { PagoCuentaPorPagarRepository } from "../../repositories/pagoCuentaPorPagar.repository";

export interface DeletePagoCuentaPorPagarUseCase {
    execute(pagoid: number, cuentapagarid: number): Promise<PagoCuentaPorPagarEntity>;
}

export class DeletePagoCuentaPorPagar implements DeletePagoCuentaPorPagarUseCase {
    constructor(private readonly repository: PagoCuentaPorPagarRepository) { }
    execute(pagoid: number, cuentapagarid: number): Promise<PagoCuentaPorPagarEntity> {
        return this.repository.delete(pagoid, cuentapagarid);
    }
}
