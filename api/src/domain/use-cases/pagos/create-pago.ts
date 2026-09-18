import {PagoEntity} from "../../entitites/pago.entity";
import {CreatePagoDto} from "../../dtos";
import {PagoRepository} from "../../repositories/pago.repository";


export interface CreatePagoUseCase {
    execute( dto: CreatePagoDto ): Promise<PagoEntity>;
}

export class CreatePago implements CreatePagoUseCase {

    constructor(private readonly pagoRepository: PagoRepository) {}

    execute(dto: CreatePagoDto): Promise<PagoEntity> {
        return this.pagoRepository.create(dto);
    }

}