import { MovimientoInventarioEntity } from "../../entitites/movimientoInventario.entity";
import { MovimientoInventarioRepository } from "../../repositories/movimientoInventario.repository";

export interface DeleteMovimientoInventarioUseCase {
    execute(id: number): Promise<MovimientoInventarioEntity>;
}

export class DeleteMovimientoInventario implements DeleteMovimientoInventarioUseCase {
    constructor(private readonly repository: MovimientoInventarioRepository) { }
    execute(id: number): Promise<MovimientoInventarioEntity> {
        return this.repository.delete(id);
    }
}
