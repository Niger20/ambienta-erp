import { VentaProductoEntity } from "../../entitites/ventaProducto.entity";
import { VentaProductoRepository } from "../../repositories/ventaProducto.repository";


export interface DeleteVentaProductoUseCase {
    execute(ventaid: number, productoid: number): Promise<VentaProductoEntity>;
}

export class DeleteVentaProducto implements DeleteVentaProductoUseCase {

    constructor(private readonly repository: VentaProductoRepository) { }

    execute(ventaid: number, productoid: number): Promise<VentaProductoEntity> {
        return this.repository.delete(ventaid, productoid);
    }

}
