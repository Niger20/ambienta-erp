import { MovimientoCompraEntity } from "../../entitites/movimientoCompra.entity";
import { MovimientoCompraRepository } from "../../repositories/movimientoCompra.repository";

export interface DeleteMovimientoCompraUseCase {
    execute(movimientocompraid: number, compraid: number): Promise<MovimientoCompraEntity>;
}

export class DeleteMovimientoCompra implements DeleteMovimientoCompraUseCase {
    constructor(private readonly repository: MovimientoCompraRepository) { }
    execute(movimientocompraid: number, compraid: number): Promise<MovimientoCompraEntity> {
        return this.repository.delete(movimientocompraid, compraid);
    }
}
