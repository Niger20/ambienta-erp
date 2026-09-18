import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { DeliveryEntity } from "../../entitites/delivery.entity";
import { DeliveryRepository } from "../../repositories/delivery.repository";


export interface GetDeliveryUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<DeliveryEntity>>;
}

export class GetDelivery implements GetDeliveryUseCase {

    constructor(private readonly deliveryRepository: DeliveryRepository) { }

    execute(page?: number, limit?: number): Promise<PaginatedResult<DeliveryEntity>> {
        return this.deliveryRepository.getAll(page, limit);
    }

}
