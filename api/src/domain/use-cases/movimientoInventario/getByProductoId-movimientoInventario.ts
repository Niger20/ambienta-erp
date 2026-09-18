import { MovimientoInventarioEntity } from "../../entitites/movimientoInventario.entity";
import { MovimientoInventarioRepository } from "../../repositories/movimientoInventario.repository";

export interface GetByProductoIdMovimientoInventarioUseCase {
    execute(productoid: number): Promise<MovimientoInventarioEntity[]>;
}

export class GetByProductoIdMovimientoInventario implements GetByProductoIdMovimientoInventarioUseCase {
    constructor(private readonly repository: MovimientoInventarioRepository) { }
    execute(productoid: number): Promise<MovimientoInventarioEntity[]> {
        return this.repository.getByProductoId(productoid);
    }
}
