import { CreateMermaDto } from "../../dtos/merma/create-merma.dto";
import { MermaEntity } from "../../entitites/merma.entity";
import { MermaRepository } from "../../repositories/merma.repository";

export interface CreateMermaUseCase {
    execute(dto: CreateMermaDto): Promise<MermaEntity>;
}

export class CreateMerma implements CreateMermaUseCase {
    constructor(private readonly repository: MermaRepository) {}

    execute(dto: CreateMermaDto): Promise<MermaEntity> {
        return this.repository.create(dto);
    }
}
