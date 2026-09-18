import { MovimientoCompraEntity } from "../../entitites/movimientoCompra.entity";
import { MovimientoCompraRepository } from "../../repositories/movimientoCompra.repository";

export interface GetByCompraIdMovimientoCompraUseCase {
    execute(compraid: number): Promise<MovimientoCompraEntity[]>;
}

export class GetByCompraIdMovimientoCompra implements GetByCompraIdMovimientoCompraUseCase {
    constructor(private readonly repository: MovimientoCompraRepository) { }
    execute(compraid: number): Promise<MovimientoCompraEntity[]> {
        return this.repository.getByCompraId(compraid);
    }
}
