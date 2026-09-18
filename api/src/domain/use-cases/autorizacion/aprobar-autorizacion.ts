import { AutorizacionEntity } from "../../entitites/autorizacion.entity";
import { AutorizacionRepository } from "../../repositories/autorizacion.repository";

export interface AprobarAutorizacionUseCase {
    execute(id: number): Promise<{ autorizacion: AutorizacionEntity; codigo: string; }>;
}

export class AprobarAutorizacion implements AprobarAutorizacionUseCase {
    constructor(private readonly repository: AutorizacionRepository) { }

    execute(id: number): Promise<{ autorizacion: AutorizacionEntity; codigo: string; }> {
        return this.repository.aprobar(id);
    }
}
