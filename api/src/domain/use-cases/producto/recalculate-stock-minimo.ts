import { ProductoRepository } from "../../repositories/producto.repository";

export interface RecalculateStockMinimoUseCase {
    execute(): Promise<void>;
}

export class RecalculateStockMinimo implements RecalculateStockMinimoUseCase {

    constructor(private readonly productoRepository: ProductoRepository) {}

    execute(): Promise<void> {
        return this.productoRepository.recalculateStockMinimo();
    }

}
