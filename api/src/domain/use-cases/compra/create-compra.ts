import { CompraEntity } from "../../entitites/compra.entity";
import { CreateCompraDto } from "../../dtos";
import { CompraRepository } from "../../repositories/compra.repository";

export interface CreateCompraUseCase {
    execute(dto: CreateCompraDto): Promise<CompraEntity>;
}

export class CreateCompra implements CreateCompraUseCase {
    constructor(private readonly repository: CompraRepository) { }
    execute(dto: CreateCompraDto): Promise<CompraEntity> {
        return this.repository.create(dto);
    }
}
