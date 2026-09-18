import { UpdateVentaPagoDto } from "../../dtos/venta-pago/update-venta-pago.dto";
import { VentaPagoEntity } from "../../entitites/venta-pago.entity";
import { VentaPagoRepository } from "../../repositories/venta-pago.repository";

export interface UpdateVentaPagoUseCase {
    execute(dto: UpdateVentaPagoDto): Promise<VentaPagoEntity | null>;
}

export class UpdateVentaPago implements UpdateVentaPagoUseCase {
    constructor(private readonly repository: VentaPagoRepository) {}

    execute(dto: UpdateVentaPagoDto): Promise<VentaPagoEntity | null> {
        return this.repository.update(dto);
    }
}
