import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import {RepartidorEntity} from "../../entitites/repartidor.entity";
import {RepartidorRepository} from "../../repositories/repartidor.repository";


export interface GetRepartidorUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<RepartidorEntity>>;
}

export class GetRepartidor implements GetRepartidorUseCase {

    constructor(private readonly repartidorRepository: RepartidorRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<RepartidorEntity>> {
        return this.repartidorRepository.getAll(page, limit);
    }

}