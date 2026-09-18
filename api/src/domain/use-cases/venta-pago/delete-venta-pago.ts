import { VentaPagoEntity } from "../../entitites/venta-pago.entity";
import { VentaPagoRepository } from "../../repositories/venta-pago.repository";

export interface DeleteVentaPagoUseCase {
    execute(id: number): Promise<VentaPagoEntity>;
}

export class DeleteVentaPago implements DeleteVentaPagoUseCase {
    constructor(private readonly repository: VentaPagoRepository) {}

    execute(id: number): Promise<VentaPagoEntity> {
        return this.repository.delete(id);
    }
}
