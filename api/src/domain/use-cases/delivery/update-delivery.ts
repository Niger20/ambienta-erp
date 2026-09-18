import { DeliveryEntity } from "../../entitites/delivery.entity";
import { UpdateDeliveryDto } from "../../dtos";
import { DeliveryRepository } from "../../repositories/delivery.repository";


export interface UpdateDeliveryUseCase {
    execute(dto: UpdateDeliveryDto): Promise<DeliveryEntity | null>;
}

export class UpdateDelivery implements UpdateDeliveryUseCase {

    constructor(private readonly deliveryRepository: DeliveryRepository) { }

    execute(dto: UpdateDeliveryDto): Promise<DeliveryEntity | null> {
        return this.deliveryRepository.update(dto);
    }

}
