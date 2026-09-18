import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { AbonoEntity } from "../../entitites/abono.entity";
import { AbonoRepository } from "../../repositories/abono.repository";

export interface GetAbonoUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<AbonoEntity>>;
}

export class GetAbono implements GetAbonoUseCase {
    constructor(private readonly repository: AbonoRepository) { }
    execute(page?: number, limit?: number): Promise<PaginatedResult<AbonoEntity>> {
        return this.repository.getAll();
    }
}
