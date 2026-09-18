import { CreateOrdenCompraDto } from "../../dtos/orden-compra/create-orden-compra.dto";
import { OrdenCompraEntity } from "../../entitites/orden-compra.entity";
import { OrdenCompraRepository } from "../../repositories/orden-compra.repository";

export interface CreateOrdenCompraUseCase {
    execute(dto: CreateOrdenCompraDto): Promise<OrdenCompraEntity>;
}

export class CreateOrdenCompra implements CreateOrdenCompraUseCase {
    constructor(private readonly repository: OrdenCompraRepository) {}

    execute(dto: CreateOrdenCompraDto): Promise<OrdenCompraEntity> {
        return this.repository.create(dto);
    }
}
