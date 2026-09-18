import { RegistroAsistenciaEntity } from "../../entitites/registro-asistencia.entity";
import { RegistroAsistenciaRepository } from "../../repositories/registro-asistencia.repository";

export interface DeleteRegistroAsistenciaUseCase {
    execute(id: number): Promise<RegistroAsistenciaEntity>;
}

export class DeleteRegistroAsistencia implements DeleteRegistroAsistenciaUseCase {
    constructor(private readonly repository: RegistroAsistenciaRepository) {}

    execute(id: number): Promise<RegistroAsistenciaEntity> {
        return this.repository.delete(id);
    }
}
