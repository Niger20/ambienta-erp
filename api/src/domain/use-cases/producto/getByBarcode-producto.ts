import {ProductoEntity} from "../../entitites/producto.entity";
import {ProductoRepository} from "../../repositories/producto.repository";


export interface GetByBarcodeProductoUseCase {
    execute( codigobarra : string ): Promise<ProductoEntity|null>;
}

export class GetByBarcodeProducto implements GetByBarcodeProductoUseCase {

    constructor(private readonly productoRepository: ProductoRepository) {}

    execute( codigobarra : string): Promise<ProductoEntity|null> {
        return this.productoRepository.getByBarcode(codigobarra);
    }

}
