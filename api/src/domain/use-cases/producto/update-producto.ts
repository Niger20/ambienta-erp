import {ProductoEntity} from "../../entitites/producto.entity";
import { UpdateProductoDto} from "../../dtos";
import {ProductoRepository} from "../../repositories/producto.repository";


export interface UpdateProductoUseCase {
    execute( dto: UpdateProductoDto ): Promise<ProductoEntity|null>;
}

export class UpdateProducto implements UpdateProductoUseCase {

    constructor(private readonly productoRepository: ProductoRepository) {}

    execute(dto: UpdateProductoDto): Promise<ProductoEntity|null> {
        return this.productoRepository.update(dto);
    }

}