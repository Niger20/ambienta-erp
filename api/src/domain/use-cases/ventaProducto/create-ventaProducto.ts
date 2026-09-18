import { VentaProductoEntity } from "../../entitites/ventaProducto.entity";
import { CreateVentaProductoDto } from "../../dtos";
import { VentaProductoRepository } from "../../repositories/ventaProducto.repository";


export interface CreateVentaProductoUseCase {
    execute(dto: CreateVentaProductoDto): Promise<VentaProductoEntity>;
}

export class CreateVentaProducto implements CreateVentaProductoUseCase {

    constructor(private readonly repository: VentaProductoRepository) { }

    execute(dto: CreateVentaProductoDto): Promise<VentaProductoEntity> {
        return this.repository.create(dto);
    }

}
