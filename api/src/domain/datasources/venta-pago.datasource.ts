import { CreateVentaPagoDto } from "../dtos/venta-pago/create-venta-pago.dto";
import { UpdateVentaPagoDto } from "../dtos/venta-pago/update-venta-pago.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { VentaPagoEntity } from "../entitites/venta-pago.entity";

export abstract class VentaPagoDatasource {
    abstract create(dto: CreateVentaPagoDto): Promise<VentaPagoEntity>;
    abstract getAll(page?: number, limit?: number, ventaid?: number): Promise<PaginatedResult<VentaPagoEntity>>;
    abstract getById(id: number): Promise<VentaPagoEntity | null>;
    abstract update(dto: UpdateVentaPagoDto): Promise<VentaPagoEntity | null>;
    abstract delete(id: number): Promise<VentaPagoEntity>;
}
