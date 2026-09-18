import {ProductoEntity} from "../../entitites/producto.entity";
import {ProductoRepository} from "../../repositories/producto.repository";


export interface GetByIdProductoUseCase {
    execute( id : Number ): Promise<ProductoEntity|null>;
}

export class GetByIdProducto implements GetByIdProductoUseCase {

    constructor(private readonly productoRepository: ProductoRepository) {}

    execute( id : number): Promise<ProductoEntity|null> {
        return this.productoRepository.getById(id);
    }

}