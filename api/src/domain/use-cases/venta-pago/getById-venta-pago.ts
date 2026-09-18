import { VentaPagoEntity } from "../../entitites/venta-pago.entity";
import { VentaPagoRepository } from "../../repositories/venta-pago.repository";

export interface GetByIdVentaPagoUseCase {
    execute(id: number): Promise<VentaPagoEntity | null>;
}

export class GetByIdVentaPago implements GetByIdVentaPagoUseCase {
    constructor(private readonly repository: VentaPagoRepository) {}

    execute(id: number): Promise<VentaPagoEntity | null> {
        return this.repository.getById(id);
    }
}
