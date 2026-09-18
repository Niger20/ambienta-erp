import { CreateCostoAdicionalCompraDto } from "../dtos/costo-adicional-compra/create-costo-adicional-compra.dto";
import { UpdateCostoAdicionalCompraDto } from "../dtos/costo-adicional-compra/update-costo-adicional-compra.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { CostoAdicionalCompraEntity } from "../entitites/costo-adicional-compra.entity";

export abstract class CostoAdicionalCompraRepository {
    abstract create(dto: CreateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity>;
    abstract getAll(page?: number, limit?: number, compraid?: number): Promise<PaginatedResult<CostoAdicionalCompraEntity>>;
    abstract getById(id: number): Promise<CostoAdicionalCompraEntity | null>;
    abstract update(dto: UpdateCostoAdicionalCompraDto): Promise<CostoAdicionalCompraEntity | null>;
    abstract delete(id: number): Promise<CostoAdicionalCompraEntity>;
}
