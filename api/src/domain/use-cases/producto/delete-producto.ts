import {ProductoEntity} from "../../entitites/producto.entity";
import {ProductoRepository} from "../../repositories/producto.repository";


export interface DeleteProductoUseCase {
    execute( id: number ): Promise<ProductoEntity>;
}

export class DeleteProducto implements DeleteProductoUseCase {

    constructor(private readonly productoRepository: ProductoRepository) {}

    execute( id: number): Promise<ProductoEntity> {
        return this.productoRepository.delete(id);
    }

}