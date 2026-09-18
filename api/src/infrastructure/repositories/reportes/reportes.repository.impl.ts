import { ReportesDatasource, ReportesRepository, UtilidadDiariaEntity, UtilidadProductoEntity } from "../../../domain";

export class ReportesRepositoryImpl implements ReportesRepository {
    constructor(private readonly datasource: ReportesDatasource) { }

    getUtilidadDiaria(fechaInicio: Date, fechaFin: Date): Promise<UtilidadDiariaEntity> {
        return this.datasource.getUtilidadDiaria(fechaInicio, fechaFin);
    }

    getUtilidadProducto(fechaInicio: Date, fechaFin: Date): Promise<UtilidadProductoEntity[]> {
        return this.datasource.getUtilidadProducto(fechaInicio, fechaFin);
    }
}
