import { CompraEntity } from "../../entitites/compra.entity";
import { CompraRepository } from "../../repositories/compra.repository";

export interface GetByIdCompraUseCase {
    execute(id: number): Promise<CompraEntity | null>;
}

export class GetByIdCompra implements GetByIdCompraUseCase {
    constructor(private readonly repository: CompraRepository) { }
    execute(id: number): Promise<CompraEntity | null> {
        return this.repository.getById(id);
    }
}
