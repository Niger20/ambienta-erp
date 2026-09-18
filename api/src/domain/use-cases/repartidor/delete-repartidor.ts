import {RepartidorEntity} from "../../entitites/repartidor.entity";
import {RepartidorRepository} from "../../repositories/repartidor.repository";


export interface DeleteRepartidorUseCase {
    execute( id: number ): Promise<RepartidorEntity>;
}

export class DeleteRepartidor implements DeleteRepartidorUseCase {

    constructor(private readonly repartidorRepository: RepartidorRepository) {}

    execute( id: number): Promise<RepartidorEntity> {
        return this.repartidorRepository.delete(id);
    }

}