import { VentaDeliveryEntity } from "../../entitites/ventaDelivery.entity";
import { VentaDeliveryRepository } from "../../repositories/ventaDelivery.repository";


export interface GetByDeliveryIdVentaDeliveryUseCase {
    execute(deliveryid: number): Promise<VentaDeliveryEntity[]>;
}

export class GetByDeliveryIdVentaDelivery implements GetByDeliveryIdVentaDeliveryUseCase {

    constructor(private readonly repository: VentaDeliveryRepository) { }

    execute(deliveryid: number): Promise<VentaDeliveryEntity[]> {
        return this.repository.getByDeliveryId(deliveryid);
    }

}
