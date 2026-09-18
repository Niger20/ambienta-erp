import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { AbonoEntity } from "../entitites/abono.entity";
import { CreateAbonoDto, UpdateAbonoDto } from "../dtos";

export abstract class AbonoRepository {
    abstract create(dto: CreateAbonoDto): Promise<AbonoEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<AbonoEntity>>;
    abstract getById(id: number): Promise<AbonoEntity | null>;
    abstract getByCuentaId(cuentaid: number): Promise<AbonoEntity[]>;
    abstract update(dto: UpdateAbonoDto): Promise<AbonoEntity>;
    abstract delete(id: number): Promise<AbonoEntity>;
}
