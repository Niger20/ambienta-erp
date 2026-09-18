import { UnidadMedidaEntity } from "../../entitites/unidad-medida.entity";
import { UnidadMedidaRepository } from "../../repositories/unidad-medida.repository";

export interface GetByIdUnidadMedidaUseCase {
    execute(id: number): Promise<UnidadMedidaEntity | null>;
}

export class GetByIdUnidadMedida implements GetByIdUnidadMedidaUseCase {
    constructor(private readonly repository: UnidadMedidaRepository) {}

    execute(id: number): Promise<UnidadMedidaEntity | null> {
        return this.repository.getById(id);
    }
}
