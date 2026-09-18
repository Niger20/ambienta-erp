import { VentaProductoEntity } from "../../entitites/ventaProducto.entity";
import { VentaProductoRepository } from "../../repositories/ventaProducto.repository";


export interface GetByVentaIdVentaProductoUseCase {
    execute(ventaid: number): Promise<VentaProductoEntity[]>;
}

export class GetByVentaIdVentaProducto implements GetByVentaIdVentaProductoUseCase {

    constructor(private readonly repository: VentaProductoRepository) { }

    execute(ventaid: number): Promise<VentaProductoEntity[]> {
        return this.repository.getByVentaId(ventaid);
    }

}
