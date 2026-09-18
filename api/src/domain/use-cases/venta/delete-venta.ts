import { VentaEntity } from "../../entitites/venta.entity";
import { VentaRepository } from "../../repositories/venta.repository";


export interface DeleteVentaUseCase {
    execute(id: number): Promise<VentaEntity>;
}

export class DeleteVenta implements DeleteVentaUseCase {

    constructor(private readonly ventaRepository: VentaRepository) { }

    execute(id: number): Promise<VentaEntity> {
        return this.ventaRepository.delete(id);
    }

}
