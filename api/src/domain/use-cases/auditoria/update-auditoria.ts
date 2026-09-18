import { UpdateAuditoriaDto } from "../../dtos/auditoria/update-auditoria.dto";
import { AuditoriaEntity } from "../../entitites/auditoria.entity";
import { AuditoriaRepository } from "../../repositories/auditoria.repository";

export interface UpdateAuditoriaUseCase {
    execute(dto: UpdateAuditoriaDto): Promise<AuditoriaEntity | null>;
}

export class UpdateAuditoria implements UpdateAuditoriaUseCase {
    constructor(private readonly repository: AuditoriaRepository) {}

    execute(dto: UpdateAuditoriaDto): Promise<AuditoriaEntity | null> {
        return this.repository.update(dto);
    }
}
