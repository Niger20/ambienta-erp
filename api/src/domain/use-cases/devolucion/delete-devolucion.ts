import { DevolucionEntity } from "../../entitites/devolucion.entity";
import { DevolucionRepository } from "../../repositories/devolucion.repository";

export interface DeleteDevolucionUseCase {
    execute(id: number): Promise<DevolucionEntity>;
}

export class DeleteDevolucion implements DeleteDevolucionUseCase {
    constructor(private readonly repository: DevolucionRepository) {}

    execute(id: number): Promise<DevolucionEntity> {
        return this.repository.delete(id);
    }
}
