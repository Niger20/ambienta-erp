import { UtilidadDiariaEntity } from "../../entitites/reportes/utilidad-diaria.entity";
import { ReportesRepository } from "../../repositories/reportes/reportes.repository";

export interface GetUtilidadDiariaUseCase {
    execute(fechaInicio: Date, fechaFin: Date): Promise<UtilidadDiariaEntity>;
}

export class GetUtilidadDiaria implements GetUtilidadDiariaUseCase {
    constructor(private readonly repository: ReportesRepository) { }

    execute(fechaInicio: Date, fechaFin: Date): Promise<UtilidadDiariaEntity> {
        return this.repository.getUtilidadDiaria(fechaInicio, fechaFin);
    }
}
