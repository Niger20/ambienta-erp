import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { VentaDeliveryEntity } from "../entitites/ventaDelivery.entity";
import { CreateVentaDeliveryDto } from "../dtos";


export abstract class VentaDeliveryDatasource {

    abstract create(dto: CreateVentaDeliveryDto): Promise<VentaDeliveryEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<VentaDeliveryEntity>>;
    abstract getByVentaId(ventaid: number): Promise<VentaDeliveryEntity[]>;
    abstract getByDeliveryId(deliveryid: number): Promise<VentaDeliveryEntity[]>;
    abstract delete(ventaid: number, deliveryid: number): Promise<VentaDeliveryEntity>;

}
