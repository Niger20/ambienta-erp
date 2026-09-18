import { MovimientoVentaEntity } from "../../entitites/movimientoVenta.entity";
import { MovimientoVentaRepository } from "../../repositories/movimientoVenta.repository";

export interface GetByMovimientoIdMovimientoVentaUseCase {
    execute(movimeintoventaid: number): Promise<MovimientoVentaEntity[]>;
}

export class GetByMovimientoIdMovimientoVenta implements GetByMovimientoIdMovimientoVentaUseCase {
    constructor(private readonly repository: MovimientoVentaRepository) { }
    execute(movimeintoventaid: number): Promise<MovimientoVentaEntity[]> {
        return this.repository.getByMovimientoId(movimeintoventaid);
    }
}
