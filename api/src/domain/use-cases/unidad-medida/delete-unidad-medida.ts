import { UnidadMedidaEntity } from "../../entitites/unidad-medida.entity";
import { UnidadMedidaRepository } from "../../repositories/unidad-medida.repository";

export interface DeleteUnidadMedidaUseCase {
    execute(id: number): Promise<UnidadMedidaEntity>;
}

export class DeleteUnidadMedida implements DeleteUnidadMedidaUseCase {
    constructor(private readonly repository: UnidadMedidaRepository) {}

    execute(id: number): Promise<UnidadMedidaEntity> {
        return this.repository.delete(id);
    }
}
