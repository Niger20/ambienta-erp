import { DeliveryEntity } from "../../entitites/delivery.entity";
import { DeliveryRepository } from "../../repositories/delivery.repository";


export interface GetByIdDeliveryUseCase {
    execute(id: number): Promise<DeliveryEntity | null>;
}

export class GetByIdDelivery implements GetByIdDeliveryUseCase {

    constructor(private readonly deliveryRepository: DeliveryRepository) { }

    execute(id: number): Promise<DeliveryEntity | null> {
        return this.deliveryRepository.getById(id);
    }

}
