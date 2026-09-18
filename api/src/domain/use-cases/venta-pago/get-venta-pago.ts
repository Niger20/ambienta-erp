import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { VentaPagoEntity } from "../../entitites/venta-pago.entity";
import { VentaPagoRepository } from "../../repositories/venta-pago.repository";

export interface GetVentaPagoUseCase {
    execute(page?: number, limit?: number, ventaid?: number): Promise<PaginatedResult<VentaPagoEntity>>;
}

export class GetVentaPago implements GetVentaPagoUseCase {
    constructor(private readonly repository: VentaPagoRepository) {}

    execute(page?: number, limit?: number, ventaid?: number): Promise<PaginatedResult<VentaPagoEntity>> {
        return this.repository.getAll(page, limit, ventaid);
    }
}
