import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { DeliveryEntity } from "../entitites/delivery.entity";
import { CreateDeliveryDto, UpdateDeliveryDto } from "../dtos";


export abstract class DeliveryRepository {

    abstract create(create: CreateDeliveryDto): Promise<DeliveryEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<DeliveryEntity>>;
    abstract getDeactivated(): Promise<DeliveryEntity[]>;
    abstract getById(id: number): Promise<DeliveryEntity | null>;
    abstract update(dto: UpdateDeliveryDto): Promise<DeliveryEntity | null>;
    abstract delete(id: number): Promise<DeliveryEntity>;

}
