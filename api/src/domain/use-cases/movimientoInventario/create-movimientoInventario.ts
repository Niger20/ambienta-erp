import { MovimientoInventarioEntity } from "../../entitites/movimientoInventario.entity";
import { CreateMovimientoInventarioDto } from "../../dtos";
import { MovimientoInventarioRepository } from "../../repositories/movimientoInventario.repository";

export interface CreateMovimientoInventarioUseCase {
    execute(dto: CreateMovimientoInventarioDto): Promise<MovimientoInventarioEntity>;
}

export class CreateMovimientoInventario implements CreateMovimientoInventarioUseCase {
    constructor(private readonly repository: MovimientoInventarioRepository) { }
    execute(dto: CreateMovimientoInventarioDto): Promise<MovimientoInventarioEntity> {
        return this.repository.create(dto);
    }
}
