import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateVentaPagoDto } from "../../domain/dtos/venta-pago/create-venta-pago.dto";
import { UpdateVentaPagoDto } from "../../domain/dtos/venta-pago/update-venta-pago.dto";
import { VentaPagoDatasource } from "../../domain/datasources/venta-pago.datasource";
import { VentaPagoEntity } from "../../domain/entitites/venta-pago.entity";
import { VentaPagoRepository } from "../../domain/repositories/venta-pago.repository";

export class VentaPagoRepositoryImpl implements VentaPagoRepository {
    constructor(private readonly datasource: VentaPagoDatasource) {}

    create(dto: CreateVentaPagoDto): Promise<VentaPagoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, ventaid?: number): Promise<PaginatedResult<VentaPagoEntity>> {
        return this.datasource.getAll(page, limit, ventaid);
    }

    getById(id: number): Promise<VentaPagoEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateVentaPagoDto): Promise<VentaPagoEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<VentaPagoEntity> {
        return this.datasource.delete(id);
    }
}
