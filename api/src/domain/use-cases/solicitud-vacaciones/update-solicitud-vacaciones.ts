import { UpdateSolicitudVacacionesDto } from "../../dtos/solicitud-vacaciones/update-solicitud-vacaciones.dto";
import { SolicitudVacacionesEntity } from "../../entitites/solicitud-vacaciones.entity";
import { SolicitudVacacionesRepository } from "../../repositories/solicitud-vacaciones.repository";

export interface UpdateSolicitudVacacionesUseCase {
    execute(dto: UpdateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity | null>;
}

export class UpdateSolicitudVacaciones implements UpdateSolicitudVacacionesUseCase {
    constructor(private readonly repository: SolicitudVacacionesRepository) {}

    execute(dto: UpdateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity | null> {
        return this.repository.update(dto);
    }
}
