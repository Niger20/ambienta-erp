import { PagoCuentaPorPagarEntity } from "../../entitites/pagoCuentaPorPagar.entity";
import { CreatePagoCuentaPorPagarDto } from "../../dtos";
import { PagoCuentaPorPagarRepository } from "../../repositories/pagoCuentaPorPagar.repository";

export interface CreatePagoCuentaPorPagarUseCase {
    execute(dto: CreatePagoCuentaPorPagarDto): Promise<PagoCuentaPorPagarEntity>;
}

export class CreatePagoCuentaPorPagar implements CreatePagoCuentaPorPagarUseCase {
    constructor(private readonly repository: PagoCuentaPorPagarRepository) { }
    execute(dto: CreatePagoCuentaPorPagarDto): Promise<PagoCuentaPorPagarEntity> {
        return this.repository.create(dto);
    }
}
