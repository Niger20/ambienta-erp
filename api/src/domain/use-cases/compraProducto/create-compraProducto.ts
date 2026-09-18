import { CompraProductoEntity } from "../../entitites/compraProducto.entity";
import { CreateCompraProductoDto } from "../../dtos";
import { CompraProductoRepository } from "../../repositories/compraProducto.repository";

export interface CreateCompraProductoUseCase {
    execute(dto: CreateCompraProductoDto): Promise<CompraProductoEntity>;
}

export class CreateCompraProducto implements CreateCompraProductoUseCase {
    constructor(private readonly repository: CompraProductoRepository) { }
    execute(dto: CreateCompraProductoDto): Promise<CompraProductoEntity> {
        return this.repository.create(dto);
    }
}
