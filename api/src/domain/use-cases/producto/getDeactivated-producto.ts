import { ProductoEntity } from "../../entitites/producto.entity";
import { ProductoRepository } from "../../repositories/producto.repository";

export interface GetDeactivatedProductoUseCase {
    execute(): Promise<ProductoEntity[]>;
}

export class GetDeactivatedProducto implements GetDeactivatedProductoUseCase {
    constructor(private readonly productoRepository: ProductoRepository) {}

    execute(): Promise<ProductoEntity[]> {
        return this.productoRepository.getDeactivated();
    }
}

