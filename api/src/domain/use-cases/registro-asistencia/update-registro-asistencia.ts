import { UpdateRegistroAsistenciaDto } from "../../dtos/registro-asistencia/update-registro-asistencia.dto";
import { RegistroAsistenciaEntity } from "../../entitites/registro-asistencia.entity";
import { RegistroAsistenciaRepository } from "../../repositories/registro-asistencia.repository";

export interface UpdateRegistroAsistenciaUseCase {
    execute(dto: UpdateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity | null>;
}

export class UpdateRegistroAsistencia implements UpdateRegistroAsistenciaUseCase {
    constructor(private readonly repository: RegistroAsistenciaRepository) {}

    execute(dto: UpdateRegistroAsistenciaDto): Promise<RegistroAsistenciaEntity | null> {
        return this.repository.update(dto);
    }
}
