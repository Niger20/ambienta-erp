import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateVentaDeliveryDto,
    VentaDeliveryDatasource,
    VentaDeliveryEntity,
    VentaDeliveryRepository,
} from "../../domain";


export class VentaDeliveryRepositoryImpl implements VentaDeliveryRepository {

    constructor(private readonly datasource: VentaDeliveryDatasource) { }

    create(dto: CreateVentaDeliveryDto): Promise<VentaDeliveryEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<VentaDeliveryEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getByVentaId(ventaid: number): Promise<VentaDeliveryEntity[]> {
        return this.datasource.getByVentaId(ventaid);
    }

    getByDeliveryId(deliveryid: number): Promise<VentaDeliveryEntity[]> {
        return this.datasource.getByDeliveryId(deliveryid);
    }

    delete(ventaid: number, deliveryid: number): Promise<VentaDeliveryEntity> {
        return this.datasource.delete(ventaid, deliveryid);
    }

}
