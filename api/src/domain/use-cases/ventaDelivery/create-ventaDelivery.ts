import { VentaDeliveryEntity } from "../../entitites/ventaDelivery.entity";
import { CreateVentaDeliveryDto } from "../../dtos";
import { VentaDeliveryRepository } from "../../repositories/ventaDelivery.repository";


export interface CreateVentaDeliveryUseCase {
    execute(dto: CreateVentaDeliveryDto): Promise<VentaDeliveryEntity>;
}

export class CreateVentaDelivery implements CreateVentaDeliveryUseCase {

    constructor(private readonly repository: VentaDeliveryRepository) { }

    execute(dto: CreateVentaDeliveryDto): Promise<VentaDeliveryEntity> {
        return this.repository.create(dto);
    }

}
