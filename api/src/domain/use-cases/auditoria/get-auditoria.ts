import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { AuditoriaEntity } from "../../entitites/auditoria.entity";
import { AuditoriaRepository } from "../../repositories/auditoria.repository";

export interface GetAuditoriaUseCase {
    execute(page?: number, limit?: number, tabla?: string, usuarioid?: number): Promise<PaginatedResult<AuditoriaEntity>>;
}

export class GetAuditoria implements GetAuditoriaUseCase {
    constructor(private readonly repository: AuditoriaRepository) {}

    execute(page?: number, limit?: number, tabla?: string, usuarioid?: number): Promise<PaginatedResult<AuditoriaEntity>> {
        return this.repository.getAll(page, limit, tabla, usuarioid);
    }
}
