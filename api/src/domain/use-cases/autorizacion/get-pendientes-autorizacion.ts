import { AutorizacionEntity } from "../../entitites/autorizacion.entity";
import { AutorizacionRepository } from "../../repositories/autorizacion.repository";

export interface GetPendientesAutorizacionesUseCase {
    execute(): Promise<AutorizacionEntity[]>;
}

export class GetPendientesAutorizaciones implements GetPendientesAutorizacionesUseCase {
    constructor(private readonly repository: AutorizacionRepository) {}

    execute(): Promise<AutorizacionEntity[]> {
        return this.repository.obtenerPendientes();
    }
}
