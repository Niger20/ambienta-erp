import { MovimientoInventarioEntity } from "../../entitites/movimientoInventario.entity";
import { MovimientoInventarioRepository } from "../../repositories/movimientoInventario.repository";

export interface GetByIdMovimientoInventarioUseCase {
    execute(id: number): Promise<MovimientoInventarioEntity | null>;
}

export class GetByIdMovimientoInventario implements GetByIdMovimientoInventarioUseCase {
    constructor(private readonly repository: MovimientoInventarioRepository) { }
    execute(id: number): Promise<MovimientoInventarioEntity | null> {
        return this.repository.getById(id);
    }
}
