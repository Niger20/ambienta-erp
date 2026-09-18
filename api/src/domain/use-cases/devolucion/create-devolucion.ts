import { CreateDevolucionDto } from "../../dtos/devolucion/create-devolucion.dto";
import { DevolucionEntity } from "../../entitites/devolucion.entity";
import { DevolucionRepository } from "../../repositories/devolucion.repository";

export interface CreateDevolucionUseCase {
    execute(dto: CreateDevolucionDto): Promise<DevolucionEntity>;
}

export class CreateDevolucion implements CreateDevolucionUseCase {
    constructor(private readonly repository: DevolucionRepository) {}

    execute(dto: CreateDevolucionDto): Promise<DevolucionEntity> {
        return this.repository.create(dto);
    }
}
