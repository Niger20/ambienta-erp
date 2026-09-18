import { VentaEntity } from "../../entitites/venta.entity";
import { CreateVentaDto } from "../../dtos";
import { VentaRepository } from "../../repositories/venta.repository";


export interface CreateVentaUseCase {
    execute(dto: CreateVentaDto): Promise<VentaEntity>;
}

export class CreateVenta implements CreateVentaUseCase {

    constructor(private readonly ventaRepository: VentaRepository) { }

    execute(dto: CreateVentaDto): Promise<VentaEntity> {
        return this.ventaRepository.create(dto);
    }

}
