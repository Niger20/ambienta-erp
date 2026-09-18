import { SesionEntity } from "../../entitites/sesion.entity";
import { SesionRepository } from "../../repositories/sesion.repository";


export interface GetActiveSesionUseCase {
    execute(usuarioid: number): Promise<SesionEntity | null>;
}

export class GetActiveSesion implements GetActiveSesionUseCase {

    constructor(private readonly sesionRepository: SesionRepository) { }

    execute(usuarioid: number): Promise<SesionEntity | null> {
        return this.sesionRepository.getActive(usuarioid);
    }

}
