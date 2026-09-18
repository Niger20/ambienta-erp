import { CreateUnidadMedidaDto } from "../../dtos/unidad-medida/create-unidad-medida.dto";
import { UnidadMedidaEntity } from "../../entitites/unidad-medida.entity";
import { UnidadMedidaRepository } from "../../repositories/unidad-medida.repository";

export interface CreateUnidadMedidaUseCase {
    execute(dto: CreateUnidadMedidaDto): Promise<UnidadMedidaEntity>;
}

export class CreateUnidadMedida implements CreateUnidadMedidaUseCase {
    constructor(private readonly repository: UnidadMedidaRepository) {}

    execute(dto: CreateUnidadMedidaDto): Promise<UnidadMedidaEntity> {
        return this.repository.create(dto);
    }
}
