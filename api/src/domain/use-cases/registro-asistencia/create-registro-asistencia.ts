import { CreateRegistroAsistenciaDto } from "../../dtos/registro-asistencia/create-registro-asistencia.dto";
import { RegistroAsistenciaEntity } from "../../entitites/registro-asistencia.entity";
import { RegistroAsistenciaRepository } from "../../repositories/registro-asistencia.repository";

export interface CreateRegistroAsistenciaUseCase {
    execute(dto: CreateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity>;
}

export class CreateRegistroAsistencia implements CreateRegistroAsistenciaUseCase {
    constructor(private readonly repository: RegistroAsistenciaRepository) {}

    execute(dto: CreateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity> {
        return this.repository.create(dto);
    }
}
