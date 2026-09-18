import { AcumuladoDecimoPrimerMesEntity } from "../../entitites/acumulado-decimo-primer-mes.entity";
import { AcumuladoDecimoPrimerMesRepository } from "../../repositories/acumulado-decimo-primer-mes.repository";

export interface DeleteAcumuladoDecimoPrimerMesUseCase {
    execute(id: number): Promise<AcumuladoDecimoPrimerMesEntity>;
}

export class DeleteAcumuladoDecimoPrimerMes implements DeleteAcumuladoDecimoPrimerMesUseCase {
    constructor(private readonly repository: AcumuladoDecimoPrimerMesRepository) {}

    execute(id: number): Promise<AcumuladoDecimoPrimerMesEntity> {
        return this.repository.delete(id);
    }
}
