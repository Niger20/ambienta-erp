import { DeliveryEntity } from "../../entitites/delivery.entity";
import { CreateDeliveryDto } from "../../dtos";
import { DeliveryRepository } from "../../repositories/delivery.repository";


export interface CreateDeliveryUseCase {
    execute(dto: CreateDeliveryDto): Promise<DeliveryEntity>;
}

export class CreateDelivery implements CreateDeliveryUseCase {

    constructor(private readonly deliveryRepository: DeliveryRepository) { }

    execute(dto: CreateDeliveryDto): Promise<DeliveryEntity> {
        return this.deliveryRepository.create(dto);
    }

}
