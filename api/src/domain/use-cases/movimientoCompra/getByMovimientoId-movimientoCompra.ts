import { MovimientoCompraEntity } from "../../entitites/movimientoCompra.entity";
import { MovimientoCompraRepository } from "../../repositories/movimientoCompra.repository";

export interface GetByMovimientoIdMovimientoCompraUseCase {
    execute(movimientocompraid: number): Promise<MovimientoCompraEntity[]>;
}

export class GetByMovimientoIdMovimientoCompra implements GetByMovimientoIdMovimientoCompraUseCase {
    constructor(private readonly repository: MovimientoCompraRepository) { }
    execute(movimientocompraid: number): Promise<MovimientoCompraEntity[]> {
        return this.repository.getByMovimientoId(movimientocompraid);
    }
}
