import {ProductoEntity} from "../../entitites/producto.entity";
import {ProductoRepository} from "../../repositories/producto.repository";


export interface SearchProductoUseCase {
    execute( query: string ): Promise<ProductoEntity[]>;
}

export class SearchProducto implements SearchProductoUseCase {

    constructor(private readonly productoRepository: ProductoRepository) {}

    execute( query: string ): Promise<ProductoEntity[]> {
        return this.productoRepository.searchByName(query);
    }

}
