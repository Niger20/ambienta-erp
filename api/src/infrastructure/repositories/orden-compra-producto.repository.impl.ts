import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateOrdenCompraProductoDto } from "../../domain/dtos/orden-compra-producto/create-orden-compra-producto.dto";
import { UpdateOrdenCompraProductoDto } from "../../domain/dtos/orden-compra-producto/update-orden-compra-producto.dto";
import { OrdenCompraProductoDatasource } from "../../domain/datasources/orden-compra-producto.datasource";
import { OrdenCompraProductoEntity } from "../../domain/entitites/orden-compra-producto.entity";
import { OrdenCompraProductoRepository } from "../../domain/repositories/orden-compra-producto.repository";

export class OrdenCompraProductoRepositoryImpl implements OrdenCompraProductoRepository {
    constructor(private readonly datasource: OrdenCompraProductoDatasource) {}

    create(dto: CreateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, ordencompraid?: number): Promise<PaginatedResult<OrdenCompraProductoEntity>> {
        return this.datasource.getAll(page, limit, ordencompraid);
    }

    getById(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity | null> {
        return this.datasource.getById(ordencompraid, productoid);
    }

    update(dto: UpdateOrdenCompraProductoDto): Promise<OrdenCompraProductoEntity | null> {
        return this.datasource.update(dto);
    }

    delete(ordencompraid: number, productoid: number): Promise<OrdenCompraProductoEntity> {
        return this.datasource.delete(ordencompraid, productoid);
    }
}
