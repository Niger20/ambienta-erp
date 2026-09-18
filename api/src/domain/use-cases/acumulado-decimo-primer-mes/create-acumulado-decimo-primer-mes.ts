import { CreateAcumuladoDecimoPrimerMesDto } from "../../dtos/acumulado-decimo-primer-mes/create-acumulado-decimo-primer-mes.dto";
import { AcumuladoDecimoPrimerMesEntity } from "../../entitites/acumulado-decimo-primer-mes.entity";
import { AcumuladoDecimoPrimerMesRepository } from "../../repositories/acumulado-decimo-primer-mes.repository";

export interface CreateAcumuladoDecimoPrimerMesUseCase {
    execute(dto: CreateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity>;
}

export class CreateAcumuladoDecimoPrimerMes implements CreateAcumuladoDecimoPrimerMesUseCase {
    constructor(private readonly repository: AcumuladoDecimoPrimerMesRepository) {}

    execute(dto: CreateAcumuladoDecimoPrimerMesDto): Promise<AcumuladoDecimoPrimerMesEntity> {
        return this.repository.create(dto);
    }
}
