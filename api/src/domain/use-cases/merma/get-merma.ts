import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { MermaEntity } from "../../entitites/merma.entity";
import { MermaRepository } from "../../repositories/merma.repository";

export interface GetMermaUseCase {
    execute(page?: number, limit?: number, productoid?: number, usuarioid?: number): Promise<PaginatedResult<MermaEntity>>;
}

export class GetMerma implements GetMermaUseCase {
    constructor(private readonly repository: MermaRepository) {}

    execute(page?: number, limit?: number, productoid?: number, usuarioid?: number): Promise<PaginatedResult<MermaEntity>> {
        return this.repository.getAll(page, limit, productoid, usuarioid);
    }
}
