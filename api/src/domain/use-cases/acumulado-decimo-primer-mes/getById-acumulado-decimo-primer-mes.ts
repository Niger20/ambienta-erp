import { AcumuladoDecimoPrimerMesEntity } from "../../entitites/acumulado-decimo-primer-mes.entity";
import { AcumuladoDecimoPrimerMesRepository } from "../../repositories/acumulado-decimo-primer-mes.repository";

export interface GetByIdAcumuladoDecimoPrimerMesUseCase {
    execute(id: number): Promise<AcumuladoDecimoPrimerMesEntity | null>;
}

export class GetByIdAcumuladoDecimoPrimerMes implements GetByIdAcumuladoDecimoPrimerMesUseCase {
    constructor(private readonly repository: AcumuladoDecimoPrimerMesRepository) {}

    execute(id: number): Promise<AcumuladoDecimoPrimerMesEntity | null> {
        return this.repository.getById(id);
    }
}
