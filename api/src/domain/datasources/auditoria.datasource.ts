import { CreateAuditoriaDto } from "../dtos/auditoria/create-auditoria.dto";
import { UpdateAuditoriaDto } from "../dtos/auditoria/update-auditoria.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { AuditoriaEntity } from "../entitites/auditoria.entity";

export abstract class AuditoriaDatasource {
    abstract create(dto: CreateAuditoriaDto): Promise<AuditoriaEntity>;
    abstract getAll(page?: number, limit?: number, tabla?: string, usuarioid?: number): Promise<PaginatedResult<AuditoriaEntity>>;
    abstract getById(id: number): Promise<AuditoriaEntity | null>;
    abstract update(dto: UpdateAuditoriaDto): Promise<AuditoriaEntity | null>;
    abstract delete(id: number): Promise<AuditoriaEntity>;
}
