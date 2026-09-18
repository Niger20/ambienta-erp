import {PagoEntity} from "../../entitites/pago.entity";
import { UpdatePagoDto} from "../../dtos";
import {PagoRepository} from "../../repositories/pago.repository";


export interface UpdatePagoUseCase {
    execute( dto: UpdatePagoDto ): Promise<PagoEntity|null>;
}

export class UpdatePago implements UpdatePagoUseCase {

    constructor(private readonly pagoRepository: PagoRepository) {}

    execute(dto: UpdatePagoDto): Promise<PagoEntity|null> {
        return this.pagoRepository.update(dto);
    }

}