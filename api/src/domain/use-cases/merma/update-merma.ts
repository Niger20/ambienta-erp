import { UpdateMermaDto } from "../../dtos/merma/update-merma.dto";
import { MermaEntity } from "../../entitites/merma.entity";
import { MermaRepository } from "../../repositories/merma.repository";

export interface UpdateMermaUseCase {
    execute(dto: UpdateMermaDto): Promise<MermaEntity | null>;
}

export class UpdateMerma implements UpdateMermaUseCase {
    constructor(private readonly repository: MermaRepository) {}

    execute(dto: UpdateMermaDto): Promise<MermaEntity | null> {
        return this.repository.update(dto);
    }
}
