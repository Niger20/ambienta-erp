import {RepartidorEntity} from "../../entitites/repartidor.entity";
import { UpdateRepartidorDto} from "../../dtos";
import {RepartidorRepository} from "../../repositories/repartidor.repository";


export interface UpdateRepartidorUseCase {
    execute( dto: UpdateRepartidorDto ): Promise<RepartidorEntity|null>;
}

export class UpdateRepartidor implements UpdateRepartidorUseCase {

    constructor(private readonly repartidorRepository: RepartidorRepository) {}

    execute(dto: UpdateRepartidorDto): Promise<RepartidorEntity|null> {
        return this.repartidorRepository.update(dto);
    }

}