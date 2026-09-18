import { SesionEntity } from "../../entitites/sesion.entity";
import { OpenSesionDto } from "../../dtos";
import { SesionRepository } from "../../repositories/sesion.repository";


export interface OpenSesionUseCase {
    execute(dto: OpenSesionDto): Promise<SesionEntity>;
}

export class OpenSesion implements OpenSesionUseCase {

    constructor(private readonly sesionRepository: SesionRepository) { }

    execute(dto: OpenSesionDto): Promise<SesionEntity> {
        return this.sesionRepository.open(dto);
    }

}
