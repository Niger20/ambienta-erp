import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { CuentaPorCobrarEntity } from "../entitites/cuentaPorCobrar.entity";
import { CreateCuentaPorCobrarDto, UpdateCuentaPorCobrarDto } from "../dtos";

export abstract class CuentaPorCobrarRepository {
    abstract create(dto: CreateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<CuentaPorCobrarEntity>>;
    abstract getDeactivated(): Promise<CuentaPorCobrarEntity[]>;
    abstract getById(id: number): Promise<CuentaPorCobrarEntity | null>;
    abstract update(dto: UpdateCuentaPorCobrarDto): Promise<CuentaPorCobrarEntity>;
    abstract delete(id: number): Promise<CuentaPorCobrarEntity>;
}
