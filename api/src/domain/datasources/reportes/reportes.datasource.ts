import { UtilidadDiariaEntity } from "../../entitites/reportes/utilidad-diaria.entity";
import { UtilidadProductoEntity } from "../../entitites/reportes/utilidad-producto.entity";

export abstract class ReportesDatasource {
    abstract getUtilidadDiaria(fechaInicio: Date, fechaFin: Date): Promise<UtilidadDiariaEntity>;
    abstract getUtilidadProducto(fechaInicio: Date, fechaFin: Date): Promise<UtilidadProductoEntity[]>;
}
