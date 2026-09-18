import { DeliveryEntity } from "../../entitites/delivery.entity";
import { DeliveryRepository } from "../../repositories/delivery.repository";


export interface DeleteDeliveryUseCase {
    execute(id: number): Promise<DeliveryEntity>;
}

export class DeleteDelivery implements DeleteDeliveryUseCase {

    constructor(private readonly deliveryRepository: DeliveryRepository) { }

    execute(id: number): Promise<DeliveryEntity> {
        return this.deliveryRepository.delete(id);
    }

}
