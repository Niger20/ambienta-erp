import { CreateSolicitudVacacionesDto } from "../../dtos/solicitud-vacaciones/create-solicitud-vacaciones.dto";
import { SolicitudVacacionesEntity } from "../../entitites/solicitud-vacaciones.entity";
import { SolicitudVacacionesRepository } from "../../repositories/solicitud-vacaciones.repository";

export interface CreateSolicitudVacacionesUseCase {
    execute(dto: CreateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity>;
}

export class CreateSolicitudVacaciones implements CreateSolicitudVacacionesUseCase {
    constructor(private readonly repository: SolicitudVacacionesRepository) {}

    execute(dto: CreateSolicitudVacacionesDto): Promise<SolicitudVacacionesEntity> {
        return this.repository.create(dto);
    }
}
