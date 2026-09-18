import { CompraEntity } from "../../entitites/compra.entity";
import { UpdateCompraDto } from "../../dtos";
import { CompraRepository } from "../../repositories/compra.repository";

export interface UpdateCompraUseCase {
    execute(dto: UpdateCompraDto): Promise<CompraEntity | null>;
}

export class UpdateCompra implements UpdateCompraUseCase {
    constructor(private readonly repository: CompraRepository) { }
    execute(dto: UpdateCompraDto): Promise<CompraEntity | null> {
        return this.repository.update(dto);
    }
}
