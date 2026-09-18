import { SesionEntity } from "../../entitites/sesion.entity";
import { SesionRepository } from "../../repositories/sesion.repository";


export interface GetByIdSesionUseCase {
    execute(id: number): Promise<SesionEntity | null>;
}

export class GetByIdSesion implements GetByIdSesionUseCase {

    constructor(private readonly sesionRepository: SesionRepository) { }

    execute(id: number): Promise<SesionEntity | null> {
        return this.sesionRepository.getById(id);
    }

}
