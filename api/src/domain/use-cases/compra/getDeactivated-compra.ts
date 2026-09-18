import { CompraEntity } from "../../entitites/compra.entity";
import { CompraRepository } from "../../repositories/compra.repository";

export interface GetDeactivatedCompraUseCase {
    execute(): Promise<CompraEntity[]>;
}

export class GetDeactivatedCompra implements GetDeactivatedCompraUseCase {
    constructor(private readonly repository: CompraRepository) { }
    execute(): Promise<CompraEntity[]> {
        return this.repository.getDeactivated();
    }
}
