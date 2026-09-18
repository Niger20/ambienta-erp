import { AutorizacionEntity } from "../../entitites/autorizacion.entity";
import { AutorizacionRepository } from "../../repositories/autorizacion.repository";

export interface RechazarAutorizacionUseCase {
    execute(id: number): Promise<AutorizacionEntity>;
}

export class RechazarAutorizacion implements RechazarAutorizacionUseCase {
    constructor(private readonly repository: AutorizacionRepository) {}

    execute(id: number): Promise<AutorizacionEntity> {
        return this.repository.rechazar(id);
    }
}
