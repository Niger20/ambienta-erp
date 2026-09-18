import { SolicitudVacacionesEntity } from "../../entitites/solicitud-vacaciones.entity";
import { SolicitudVacacionesRepository } from "../../repositories/solicitud-vacaciones.repository";

export interface DeleteSolicitudVacacionesUseCase {
    execute(id: number): Promise<SolicitudVacacionesEntity>;
}

export class DeleteSolicitudVacaciones implements DeleteSolicitudVacacionesUseCase {
    constructor(private readonly repository: SolicitudVacacionesRepository) {}

    execute(id: number): Promise<SolicitudVacacionesEntity> {
        return this.repository.delete(id);
    }
}
