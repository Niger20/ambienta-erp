import { AutorizacionEntity } from "../../entitites/autorizacion.entity";
import { CreateAutorizacionDto } from "../../dtos/autorizacion/create-autorizacion.dto";
import { AutorizacionRepository } from "../../repositories/autorizacion.repository";

export interface CreateAutorizacionUseCase {
    execute(dto: CreateAutorizacionDto): Promise<AutorizacionEntity>;
}

export class CreateAutorizacion implements CreateAutorizacionUseCase {
    constructor(private readonly repository: AutorizacionRepository) {}

    execute(dto: CreateAutorizacionDto): Promise<AutorizacionEntity> {
        return this.repository.crear(dto);
    }
}
