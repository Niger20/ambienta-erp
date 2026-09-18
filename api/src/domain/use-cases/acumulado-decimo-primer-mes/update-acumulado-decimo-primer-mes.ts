import { UpdateAcumuladoDecimoPrimerMesDto } from "../../dtos/acumulado-decimo-primer-mes/update-acumulado-decimo-primer-mes.dto";
import { AcumuladoDecimoPrimerMesEntity } from "../../entitites/acumulado-decimo-primer-mes.entity";
import { AcumuladoDecimoPrimerMesRepository } from "../../repositories/acumulado-decimo-primer-mes.repository";

export interface UpdateAcumuladoDecimoPrimerMesUseCase {
    execute(dto: UpdateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity | null>;
}

export class UpdateAcumuladoDecimoPrimerMes implements UpdateAcumuladoDecimoPrimerMesUseCase {
    constructor(private readonly repository: AcumuladoDecimoPrimerMesRepository) {}

    execute(dto: UpdateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity | null> {
        return this.repository.update(dto);
    }
}
