import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { VentaProductoEntity } from "../entitites/ventaProducto.entity";
import { CreateVentaProductoDto } from "../dtos";


export abstract class VentaProductoDatasource {

    abstract create(dto: CreateVentaProductoDto): Promise<VentaProductoEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<VentaProductoEntity>>;
    abstract getByVentaId(ventaid: number): Promise<VentaProductoEntity[]>;
    abstract delete(ventaid: number, productoid: number): Promise<VentaProductoEntity>;

}
