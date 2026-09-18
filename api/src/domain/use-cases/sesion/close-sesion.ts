import { SesionEntity } from "../../entitites/sesion.entity";
import { CloseSesionDto } from "../../dtos";
import { SesionRepository } from "../../repositories/sesion.repository";


export interface CloseSesionUseCase {
    execute(dto: CloseSesionDto): Promise<SesionEntity>;
}

export class CloseSesion implements CloseSesionUseCase {

    constructor(private readonly sesionRepository: SesionRepository) { }

    execute(dto: CloseSesionDto): Promise<SesionEntity> {
        return this.sesionRepository.close(dto);
    }

}
