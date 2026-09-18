import { SolicitudVacacionesEntity } from "../../entitites/solicitud-vacaciones.entity";
import { SolicitudVacacionesRepository } from "../../repositories/solicitud-vacaciones.repository";

export interface GetByIdSolicitudVacacionesUseCase {
    execute(id: number): Promise<SolicitudVacacionesEntity | null>;
}

export class GetByIdSolicitudVacaciones implements GetByIdSolicitudVacacionesUseCase {
    constructor(private readonly repository: SolicitudVacacionesRepository) {}

    execute(id: number): Promise<SolicitudVacacionesEntity | null> {
        return this.repository.getById(id);
    }
}
