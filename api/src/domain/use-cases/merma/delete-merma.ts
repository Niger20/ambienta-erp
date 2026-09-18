import { MermaEntity } from "../../entitites/merma.entity";
import { MermaRepository } from "../../repositories/merma.repository";

export interface DeleteMermaUseCase {
    execute(id: number): Promise<MermaEntity>;
}

export class DeleteMerma implements DeleteMermaUseCase {
    constructor(private readonly repository: MermaRepository) {}

    execute(id: number): Promise<MermaEntity> {
        return this.repository.delete(id);
    }
}
