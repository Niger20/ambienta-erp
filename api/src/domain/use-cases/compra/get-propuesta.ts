import { CompraRepository } from "../../repositories/compra.repository";

export interface GetPropuestaUseCase {
    execute(proveedorId: number): Promise<any>;
}

export class GetPropuesta implements GetPropuestaUseCase {
    constructor(private readonly repository: CompraRepository) { }
    execute(proveedorId: number): Promise<any> {
        return this.repository.getPropuesta(proveedorId);
    }
}
