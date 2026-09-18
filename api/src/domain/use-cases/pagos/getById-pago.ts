import {PagoEntity} from "../../entitites/pago.entity";
import {PagoRepository} from "../../repositories/pago.repository";


export interface GetByIdPagoUseCase {
    execute( id : Number ): Promise<PagoEntity|null>;
}

export class GetByIdPago implements GetByIdPagoUseCase {

    constructor(private readonly pagoRepository: PagoRepository) {}

    execute( id : number): Promise<PagoEntity|null> {
        return this.pagoRepository.getById(id);
    }

}