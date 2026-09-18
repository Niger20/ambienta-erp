import { CompraRepository } from "../../repositories/compra.repository";

export interface GetPropuestaGlobalUseCase {
    execute(): Promise<any>;
}

export class GetPropuestaGlobal implements GetPropuestaGlobalUseCase {
    constructor(private readonly repository: CompraRepository) { }

    execute(): Promise<any> {
        return this.repository.getPropuestaGlobal();
    }
}
