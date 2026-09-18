import {RepartidorEntity} from "../../entitites/repartidor.entity";
import {CreateRepartidorDto} from "../../dtos";
import {RepartidorRepository} from "../../repositories/repartidor.repository";


export interface CreateRepartidorUseCase {
    execute( dto: CreateRepartidorDto ): Promise<RepartidorEntity>;
}

export class CreateRepartidor implements CreateRepartidorUseCase {

    constructor(private readonly repartidorRepository: RepartidorRepository) {}

    execute(dto: CreateRepartidorDto): Promise<RepartidorEntity> {
        return this.repartidorRepository.create(dto);
    }

}