import { MovimientoVentaEntity } from "../../entitites/movimientoVenta.entity";
import { MovimientoVentaRepository } from "../../repositories/movimientoVenta.repository";

export interface DeleteMovimientoVentaUseCase {
    execute(movimeintoventaid: number, ventaid: number): Promise<MovimientoVentaEntity>;
}

export class DeleteMovimientoVenta implements DeleteMovimientoVentaUseCase {
    constructor(private readonly repository: MovimientoVentaRepository) { }
    execute(movimeintoventaid: number, ventaid: number): Promise<MovimientoVentaEntity> {
        return this.repository.delete(movimeintoventaid, ventaid);
    }
}
