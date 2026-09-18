import { VentaDeliveryEntity } from "../../entitites/ventaDelivery.entity";
import { VentaDeliveryRepository } from "../../repositories/ventaDelivery.repository";


export interface GetByVentaIdVentaDeliveryUseCase {
    execute(ventaid: number): Promise<VentaDeliveryEntity[]>;
}

export class GetByVentaIdVentaDelivery implements GetByVentaIdVentaDeliveryUseCase {

    constructor(private readonly repository: VentaDeliveryRepository) { }

    execute(ventaid: number): Promise<VentaDeliveryEntity[]> {
        return this.repository.getByVentaId(ventaid);
    }

}
