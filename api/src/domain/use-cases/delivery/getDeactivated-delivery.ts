import { DeliveryEntity } from "../../entitites/delivery.entity";
import { DeliveryRepository } from "../../repositories/delivery.repository";

export interface GetDeactivatedDeliveryUseCase {
    execute(): Promise<DeliveryEntity[]>;
}

export class GetDeactivatedDelivery implements GetDeactivatedDeliveryUseCase {
    constructor(private readonly deliveryRepository: DeliveryRepository) { }

    execute(): Promise<DeliveryEntity[]> {
        return this.deliveryRepository.getDeactivated();
    }
}
