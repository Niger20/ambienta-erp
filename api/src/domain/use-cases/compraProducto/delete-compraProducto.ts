import { CompraProductoEntity } from "../../entitites/compraProducto.entity";
import { CompraProductoRepository } from "../../repositories/compraProducto.repository";

export interface DeleteCompraProductoUseCase {
    execute(compraid: number, productoid: number): Promise<CompraProductoEntity>;
}

export class DeleteCompraProducto implements DeleteCompraProductoUseCase {
    constructor(private readonly repository: CompraProductoRepository) { }
    execute(compraid: number, productoid: number): Promise<CompraProductoEntity> {
        return this.repository.delete(compraid, productoid);
    }
}
