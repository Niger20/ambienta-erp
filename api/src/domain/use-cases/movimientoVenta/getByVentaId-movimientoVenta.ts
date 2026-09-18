import { MovimientoVentaEntity } from "../../entitites/movimientoVenta.entity";
import { MovimientoVentaRepository } from "../../repositories/movimientoVenta.repository";

export interface GetByVentaIdMovimientoVentaUseCase {
    execute(ventaid: number): Promise<MovimientoVentaEntity[]>;
}

export class GetByVentaIdMovimientoVenta implements GetByVentaIdMovimientoVentaUseCase {
    constructor(private readonly repository: MovimientoVentaRepository) { }
    execute(ventaid: number): Promise<MovimientoVentaEntity[]> {
        return this.repository.getByVentaId(ventaid);
    }
}
