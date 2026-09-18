import { AutorizacionRepository } from "../../repositories/autorizacion.repository";

export interface GetEstadoAutorizacionUseCase {
    execute(id: number): Promise<string | null>;
}

export class GetEstadoAutorizacion implements GetEstadoAutorizacionUseCase {
    constructor(private readonly repository: AutorizacionRepository) { }

    execute(id: number): Promise<string | null> {
        return this.repository.obtenerEstado(id);
    }
}
