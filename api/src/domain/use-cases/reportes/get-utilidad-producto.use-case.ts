import { UtilidadProductoEntity } from "../../entitites/reportes/utilidad-producto.entity";
import { ReportesRepository } from "../../repositories/reportes/reportes.repository";

export interface GetUtilidadProductoUseCase {
    execute(fechaInicio: Date, fechaFin: Date): Promise<UtilidadProductoEntity[]>;
}

export class GetUtilidadProducto implements GetUtilidadProductoUseCase {
    constructor(private readonly repository: ReportesRepository) { }

    execute(fechaInicio: Date, fechaFin: Date): Promise<UtilidadProductoEntity[]> {
        return this.repository.getUtilidadProducto(fechaInicio, fechaFin);
    }
}
