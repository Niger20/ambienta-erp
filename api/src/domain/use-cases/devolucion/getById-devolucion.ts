import { DevolucionEntity } from "../../entitites/devolucion.entity";
import { DevolucionRepository } from "../../repositories/devolucion.repository";

export interface GetByIdDevolucionUseCase {
    execute(id: number): Promise<DevolucionEntity | null>;
}

export class GetByIdDevolucion implements GetByIdDevolucionUseCase {
    constructor(private readonly repository: DevolucionRepository) {}

    execute(id: number): Promise<DevolucionEntity | null> {
        return this.repository.getById(id);
    }
}
