import { AuditoriaEntity } from "../../entitites/auditoria.entity";
import { AuditoriaRepository } from "../../repositories/auditoria.repository";

export interface GetByIdAuditoriaUseCase {
    execute(id: number): Promise<AuditoriaEntity | null>;
}

export class GetByIdAuditoria implements GetByIdAuditoriaUseCase {
    constructor(private readonly repository: AuditoriaRepository) {}

    execute(id: number): Promise<AuditoriaEntity | null> {
        return this.repository.getById(id);
    }
}
