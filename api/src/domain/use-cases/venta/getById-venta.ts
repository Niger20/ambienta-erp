import { VentaEntity } from "../../entitites/venta.entity";
import { VentaRepository } from "../../repositories/venta.repository";


export interface GetByIdVentaUseCase {
    execute(id: number): Promise<VentaEntity | null>;
}

export class GetByIdVenta implements GetByIdVentaUseCase {

    constructor(private readonly ventaRepository: VentaRepository) { }

    execute(id: number): Promise<VentaEntity | null> {
        return this.ventaRepository.getById(id);
    }

}
