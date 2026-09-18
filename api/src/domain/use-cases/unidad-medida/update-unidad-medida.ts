import { UpdateUnidadMedidaDto } from "../../dtos/unidad-medida/update-unidad-medida.dto";
import { UnidadMedidaEntity } from "../../entitites/unidad-medida.entity";
import { UnidadMedidaRepository } from "../../repositories/unidad-medida.repository";

export interface UpdateUnidadMedidaUseCase {
    execute(dto: UpdateUnidadMedidaDto): Promise<UnidadMedidaEntity | null>;
}

export class UpdateUnidadMedida implements UpdateUnidadMedidaUseCase {
    constructor(private readonly repository: UnidadMedidaRepository) {}

    execute(dto: UpdateUnidadMedidaDto): Promise<UnidadMedidaEntity | null> {
        return this.repository.update(dto);
    }
}
