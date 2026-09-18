import { VentaDeliveryEntity } from "../../entitites/ventaDelivery.entity";
import { VentaDeliveryRepository } from "../../repositories/ventaDelivery.repository";


export interface DeleteVentaDeliveryUseCase {
    execute(ventaid: number, deliveryid: number): Promise<VentaDeliveryEntity>;
}

export class DeleteVentaDelivery implements DeleteVentaDeliveryUseCase {

    constructor(private readonly repository: VentaDeliveryRepository) { }

    execute(ventaid: number, deliveryid: number): Promise<VentaDeliveryEntity> {
        return this.repository.delete(ventaid, deliveryid);
    }

}
