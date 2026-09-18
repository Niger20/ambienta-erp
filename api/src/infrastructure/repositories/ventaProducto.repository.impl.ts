import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateVentaProductoDto,
    VentaProductoDatasource,
    VentaProductoEntity,
    VentaProductoRepository,
} from "../../domain";


export class VentaProductoRepositoryImpl implements VentaProductoRepository {

    constructor(private readonly datasource: VentaProductoDatasource) { }

    create(dto: CreateVentaProductoDto): Promise<VentaProductoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<VentaProductoEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getByVentaId(ventaid: number): Promise<VentaProductoEntity[]> {
        return this.datasource.getByVentaId(ventaid);
    }

    delete(ventaid: number, productoid: number): Promise<VentaProductoEntity> {
        return this.datasource.delete(ventaid, productoid);
    }

}
