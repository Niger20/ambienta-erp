import { RegistroAsistenciaEntity } from "../../entitites/registro-asistencia.entity";
import { RegistroAsistenciaRepository } from "../../repositories/registro-asistencia.repository";

export interface GetByIdRegistroAsistenciaUseCase {
    execute(id: number): Promise<RegistroAsistenciaEntity | null>;
}

export class GetByIdRegistroAsistencia implements GetByIdRegistroAsistenciaUseCase {
    constructor(private readonly repository: RegistroAsistenciaRepository) {}

    execute(id: number): Promise<RegistroAsistenciaEntity | null> {
        return this.repository.getById(id);
    }
}
