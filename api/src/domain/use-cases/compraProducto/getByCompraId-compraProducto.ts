import { CompraProductoEntity } from "../../entitites/compraProducto.entity";
import { CompraProductoRepository } from "../../repositories/compraProducto.repository";

export interface GetByCompraIdCompraProductoUseCase {
    execute(compraid: number): Promise<CompraProductoEntity[]>;
}

export class GetByCompraIdCompraProducto implements GetByCompraIdCompraProductoUseCase {
    constructor(private readonly repository: CompraProductoRepository) { }
    execute(compraid: number): Promise<CompraProductoEntity[]> {
        return this.repository.getByCompraId(compraid);
    }
}
