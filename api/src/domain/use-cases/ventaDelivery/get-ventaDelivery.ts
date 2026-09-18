import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { VentaDeliveryEntity } from "../../entitites/ventaDelivery.entity";
import { VentaDeliveryRepository } from "../../repositories/ventaDelivery.repository";


export interface GetVentaDeliveryUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<VentaDeliveryEntity>>;
}

export class GetVentaDelivery implements GetVentaDeliveryUseCase {

    constructor(private readonly repository: VentaDeliveryRepository) { }

    execute(page?: number, limit?: number): Promise<PaginatedResult<VentaDeliveryEntity>> {
        return this.repository.getAll();
    }

}
