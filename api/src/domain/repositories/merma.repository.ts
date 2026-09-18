import { CreateMermaDto } from "../dtos/merma/create-merma.dto";
import { UpdateMermaDto } from "../dtos/merma/update-merma.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { MermaEntity } from "../entitites/merma.entity";

export abstract class MermaRepository {
    abstract create(dto: CreateMermaDto): Promise<MermaEntity>;
    abstract getAll(page?: number, limit?: number, productoid?: number, usuarioid?: number): Promise<PaginatedResult<MermaEntity>>;
    abstract getById(id: number): Promise<MermaEntity | null>;
    abstract update(dto: UpdateMermaDto): Promise<MermaEntity | null>;
    abstract delete(id: number): Promise<MermaEntity>;
}
