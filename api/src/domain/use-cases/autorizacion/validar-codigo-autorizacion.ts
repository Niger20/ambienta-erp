import { AutorizacionRepository } from "../../repositories/autorizacion.repository";

export interface ValidarCodigoAutorizacionUseCase {
    execute(accion: string, codigo: string): Promise<boolean>;
}

export class ValidarCodigoAutorizacion implements ValidarCodigoAutorizacionUseCase {
    constructor(private readonly repository: AutorizacionRepository) { }

    execute(accion: string, codigo: string): Promise<boolean> {
        return this.repository.validarCodigo(accion, codigo);
    }
}
