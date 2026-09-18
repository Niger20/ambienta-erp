import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import {PagoEntity} from "../../entitites/pago.entity";
import {PagoRepository} from "../../repositories/pago.repository";


export interface GetPagoUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<PagoEntity>>;
}

export class GetPago implements GetPagoUseCase {

    constructor(private readonly pagoRepository: PagoRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<PagoEntity>> {
        return this.pagoRepository.getAll(page, limit);
    }

}