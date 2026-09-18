import { MovimientoVentaEntity } from "../../entitites/movimientoVenta.entity";
import { CreateMovimientoVentaDto } from "../../dtos";
import { MovimientoVentaRepository } from "../../repositories/movimientoVenta.repository";

export interface CreateMovimientoVentaUseCase {
    execute(dto: CreateMovimientoVentaDto): Promise<MovimientoVentaEntity>;
}

export class CreateMovimientoVenta implements CreateMovimientoVentaUseCase {
    constructor(private readonly repository: MovimientoVentaRepository) { }
    execute(dto: CreateMovimientoVentaDto): Promise<MovimientoVentaEntity> {
        return this.repository.create(dto);
    }
}
