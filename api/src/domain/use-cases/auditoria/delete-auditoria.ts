import { AuditoriaEntity } from "../../entitites/auditoria.entity";
import { AuditoriaRepository } from "../../repositories/auditoria.repository";

export interface DeleteAuditoriaUseCase {
    execute(id: number): Promise<AuditoriaEntity>;
}

export class DeleteAuditoria implements DeleteAuditoriaUseCase {
    constructor(private readonly repository: AuditoriaRepository) {}

    execute(id: number): Promise<AuditoriaEntity> {
        return this.repository.delete(id);
    }
}
