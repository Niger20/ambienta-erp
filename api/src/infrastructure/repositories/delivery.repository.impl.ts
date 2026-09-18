import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateDeliveryDto,
    DeliveryDatasource,
    DeliveryEntity,
    DeliveryRepository,
    UpdateDeliveryDto
} from "../../domain";


export class DeliveryRepositoryImpl implements DeliveryRepository {

    constructor(private readonly datasource: DeliveryDatasource) { }

    create(createDeliveryDto: CreateDeliveryDto): Promise<DeliveryEntity> {
        return this.datasource.create(createDeliveryDto);
    }

    delete(id: number): Promise<DeliveryEntity> {
        return this.datasource.delete(id);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<DeliveryEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getDeactivated(): Promise<DeliveryEntity[]> {
        return this.datasource.getDeactivated();
    }

    getById(id: number): Promise<DeliveryEntity | null> {
        return this.datasource.getById(id);
    }

    update(updateDeliveryDto: UpdateDeliveryDto): Promise<DeliveryEntity | null> {
        return this.datasource.update(updateDeliveryDto);
    }

}
