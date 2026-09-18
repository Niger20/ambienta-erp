import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateOrdenCompraDto } from "../../domain/dtos/orden-compra/create-orden-compra.dto";
import { UpdateOrdenCompraDto } from "../../domain/dtos/orden-compra/update-orden-compra.dto";
import { OrdenCompraDatasource } from "../../domain/datasources/orden-compra.datasource";
import { OrdenCompraEntity } from "../../domain/entitites/orden-compra.entity";
import { OrdenCompraRepository } from "../../domain/repositories/orden-compra.repository";

export class OrdenCompraRepositoryImpl implements OrdenCompraRepository {
    constructor(private readonly datasource: OrdenCompraDatasource) {}

    create(dto: CreateOrdenCompraDto): Promise<OrdenCompraEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, proveedorid?: number, estado?: string): Promise<PaginatedResult<OrdenCompraEntity>> {
        return this.datasource.getAll(page, limit, proveedorid, estado);
    }

    getById(id: number): Promise<OrdenCompraEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateOrdenCompraDto): Promise<OrdenCompraEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<OrdenCompraEntity> {
        return this.datasource.delete(id);
    }
}
