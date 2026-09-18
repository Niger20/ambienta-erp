import { CreateAuditoriaDto } from "../../dtos/auditoria/create-auditoria.dto";
import { AuditoriaEntity } from "../../entitites/auditoria.entity";
import { AuditoriaRepository } from "../../repositories/auditoria.repository";

export interface CreateAuditoriaUseCase {
    execute(dto: CreateAuditoriaDto): Promise<AuditoriaEntity>;
}

export class CreateAuditoria implements CreateAuditoriaUseCase {
    constructor(private readonly repository: AuditoriaRepository) {}

    execute(dto: CreateAuditoriaDto): Promise<AuditoriaEntity> {
        return this.repository.create(dto);
    }
}
