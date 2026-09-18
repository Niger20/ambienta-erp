import { VentaEntity } from "../../entitites/venta.entity";
import { UpdateVentaDto } from "../../dtos";
import { VentaRepository } from "../../repositories/venta.repository";


export interface UpdateVentaUseCase {
    execute(dto: UpdateVentaDto): Promise<VentaEntity | null>;
}

export class UpdateVenta implements UpdateVentaUseCase {

    constructor(private readonly ventaRepository: VentaRepository) { }

    execute(dto: UpdateVentaDto): Promise<VentaEntity | null> {
        return this.ventaRepository.update(dto);
    }

}
