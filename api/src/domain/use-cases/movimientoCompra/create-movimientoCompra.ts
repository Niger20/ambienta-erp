import { MovimientoCompraEntity } from "../../entitites/movimientoCompra.entity";
import { CreateMovimientoCompraDto } from "../../dtos";
import { MovimientoCompraRepository } from "../../repositories/movimientoCompra.repository";

export interface CreateMovimientoCompraUseCase {
    execute(dto: CreateMovimientoCompraDto): Promise<MovimientoCompraEntity>;
}

export class CreateMovimientoCompra implements CreateMovimientoCompraUseCase {
    constructor(private readonly repository: MovimientoCompraRepository) { }
    execute(dto: CreateMovimientoCompraDto): Promise<MovimientoCompraEntity> {
        return this.repository.create(dto);
    }
}
