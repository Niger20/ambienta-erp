import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { CuentaPorPagarEntity } from "../entitites/cuentaPorPagar.entity";
import { CreateCuentaPorPagarDto, UpdateCuentaPorPagarDto } from "../dtos";

export abstract class CuentaPorPagarRepository {
    abstract create(dto: CreateCuentaPorPagarDto): Promise<CuentaPorPagarEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<CuentaPorPagarEntity>>;
    abstract getDeactivated(): Promise<CuentaPorPagarEntity[]>;
    abstract getById(id: number): Promise<CuentaPorPagarEntity | null>;
    abstract update(dto: UpdateCuentaPorPagarDto): Promise<CuentaPorPagarEntity>;
    abstract delete(id: number): Promise<CuentaPorPagarEntity>;
}
