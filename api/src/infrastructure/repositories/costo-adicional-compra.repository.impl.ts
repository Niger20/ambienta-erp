import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateCostoAdicionalCompraDto } from "../../domain/dtos/costo-adicional-compra/create-costo-adicional-compra.dto";
import { UpdateCostoAdicionalCompraDto } from "../../domain/dtos/costo-adicional-compra/update-costo-adicional-compra.dto";
import { CostoAdicionalCompraDatasource } from "../../domain/datasources/costo-adicional-compra.datasource";
import { CostoAdicionalCompraEntity } from "../../domain/entitites/costo-adicional-compra.entity";
import { CostoAdicionalCompraRepository } from "../../domain/repositories/costo-adicional-compra.repository";

export class CostoAdicionalCompraRepositoryImpl implements CostoAdicionalCompraRepository {
    constructor(private readonly datasource: CostoAdicionalCompraDatasource) {}

    create(dto: CreateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, compraid?: number): Promise<PaginatedResult<CostoAdicionalCompraEntity>> {
        return this.datasource.getAll(page, limit, compraid);
    }

    getById(id: number): Promise<CostoAdicionalCompraEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<CostoAdicionalCompraEntity> {
        return this.datasource.delete(id);
    }
}
