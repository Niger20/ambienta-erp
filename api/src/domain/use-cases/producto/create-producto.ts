
import {ProductoEntity} from "../../entitites/producto.entity";
import {CreateProductoDto} from "../../dtos";
import {ProductoRepository} from "../../repositories/producto.repository";


export interface CreateProductoUseCase {
    execute( dto: CreateProductoDto ): Promise<ProductoEntity>;
}

export class CreateProducto implements CreateProductoUseCase {

    constructor(private readonly productoRepository: ProductoRepository) {}

    execute(dto: CreateProductoDto): Promise<ProductoEntity> {
        return this.productoRepository.create(dto);
    }

}