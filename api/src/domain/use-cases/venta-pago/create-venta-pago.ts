import { CreateVentaPagoDto } from "../../dtos/venta-pago/create-venta-pago.dto";
import { VentaPagoEntity } from "../../entitites/venta-pago.entity";
import { VentaPagoRepository } from "../../repositories/venta-pago.repository";

export interface CreateVentaPagoUseCase {
    execute(dto: CreateVentaPagoDto): Promise<VentaPagoEntity>;
}

export class CreateVentaPago implements CreateVentaPagoUseCase {
    constructor(private readonly repository: VentaPagoRepository) {}

    execute(dto: CreateVentaPagoDto): Promise<VentaPagoEntity> {
        return this.repository.create(dto);
    }
}
