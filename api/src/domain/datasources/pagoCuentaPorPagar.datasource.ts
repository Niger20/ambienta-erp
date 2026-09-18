import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { PagoCuentaPorPagarEntity } from "../entitites/pagoCuentaPorPagar.entity";
import { CreatePagoCuentaPorPagarDto } from "../dtos";

export abstract class PagoCuentaPorPagarDatasource {
    abstract create(dto: CreatePagoCuentaPorPagarDto): Promise<PagoCuentaPorPagarEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<PagoCuentaPorPagarEntity>>;
    abstract getByPagoId(pagoid: number): Promise<PagoCuentaPorPagarEntity[]>;
    abstract getByCuentaPagarId(cuentapagarid: number): Promise<PagoCuentaPorPagarEntity[]>;
    abstract delete(pagoid: number, cuentapagarid: number): Promise<PagoCuentaPorPagarEntity>;
}
