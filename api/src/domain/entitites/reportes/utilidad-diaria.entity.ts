export class UtilidadDiariaEntity {
    constructor(
        public readonly ingresos: number,
        public readonly costoVentas: number,
        public readonly gastos: number,
        public readonly utilidadNeta: number,
        public readonly fechaInicio: Date,
        public readonly fechaFin: Date
    ) { }

    public static fromObject(object: { [key: string]: any }): UtilidadDiariaEntity {
        const { ingresos, costoVentas, gastos, utilidadNeta, fechaInicio, fechaFin } = object;

        if (ingresos === undefined) throw "ingresos is required";
        if (costoVentas === undefined) throw "costoVentas is required";
        if (gastos === undefined) throw "gastos is required";
        if (utilidadNeta === undefined) throw "utilidadNeta is required";

        return new UtilidadDiariaEntity(
            ingresos,
            costoVentas,
            gastos,
            utilidadNeta,
            fechaInicio ? new Date(fechaInicio) : new Date(),
            fechaFin ? new Date(fechaFin) : new Date()
        );
    }
}
