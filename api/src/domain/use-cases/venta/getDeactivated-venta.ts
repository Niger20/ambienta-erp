import { VentaEntity } from "../../entitites/venta.entity";
import { VentaRepository } from "../../repositories/venta.repository";


export interface GetDeactivatedVentaUseCase {
    execute(): Promise<VentaEntity[]>;
}

export class GetDeactivatedVenta implements GetDeactivatedVentaUseCase {

    constructor(private readonly ventaRepository: VentaRepository) { }

    execute(): Promise<VentaEntity[]> {
        return this.ventaRepository.getDeactivated();
    }

}
