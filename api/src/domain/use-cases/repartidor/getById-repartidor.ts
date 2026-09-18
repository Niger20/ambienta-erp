import {RepartidorEntity} from "../../entitites/repartidor.entity";
import {RepartidorRepository} from "../../repositories/repartidor.repository";


export interface GetByIdRepartidorUseCase {
    execute( id : Number ): Promise<RepartidorEntity|null>;
}

export class GetByIdRepartidor implements GetByIdRepartidorUseCase {

    constructor(private readonly repartidorRepository: RepartidorRepository) {}

    execute( id : number): Promise<RepartidorEntity|null> {
        return this.repartidorRepository.getById(id);
    }

}