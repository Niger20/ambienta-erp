import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateMermaDto } from "../../domain/dtos/merma/create-merma.dto";
import { UpdateMermaDto } from "../../domain/dtos/merma/update-merma.dto";
import { MermaDatasource } from "../../domain/datasources/merma.datasource";
import { MermaEntity } from "../../domain/entitites/merma.entity";
import { MermaRepository } from "../../domain/repositories/merma.repository";

export class MermaRepositoryImpl implements MermaRepository {
    constructor(private readonly datasource: MermaDatasource) {}

    create(dto: CreateMermaDto): Promise<MermaEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, productoid?: number, usuarioid?: number): Promise<PaginatedResult<MermaEntity>> {
        return this.datasource.getAll(page, limit, productoid, usuarioid);
    }

    getById(id: number): Promise<MermaEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateMermaDto): Promise<MermaEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<MermaEntity> {
        return this.datasource.delete(id);
    }
}
