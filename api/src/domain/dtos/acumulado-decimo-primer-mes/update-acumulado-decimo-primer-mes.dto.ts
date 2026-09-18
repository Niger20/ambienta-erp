export class UpdateAcumuladoDecimoPrimerMesDto {

    private constructor(
        public readonly id: number,
        public readonly empleadoid?: number,
        public readonly periodoid?: number,
        public readonly salariobruto?: number,
        public readonly montoacumulado?: number,
        public readonly montopagado?: number,
        public readonly fechageneracion?: Date | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.periodoid != null) returnObj.periodoid = this.periodoid;
        if (this.salariobruto != null) returnObj.salariobruto = this.salariobruto;
        if (this.montoacumulado != null) returnObj.montoacumulado = this.montoacumulado;
        if (this.montopagado != null) returnObj.montopagado = this.montopagado;
        if (this.fechageneracion !== undefined) returnObj.fechageneracion = this.fechageneracion;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateAcumuladoDecimoPrimerMesDto?] {
        const { id, empleadoid, periodoid, salariobruto, montoacumulado, montopagado, fechageneracion } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedEmpleadoId: number | undefined;
        if (empleadoid != null) {
            const parsed = Number(empleadoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) return ['El empleado ID debe ser un entero válido', undefined];
            parsedEmpleadoId = parsed;
        }

        let parsedPeriodoId: number | undefined;
        if (periodoid != null) {
            const parsed = Number(periodoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) return ['El período ID debe ser un entero válido', undefined];
            parsedPeriodoId = parsed;
        }

        let parsedFecha: Date | null | undefined;
        if (fechageneracion !== undefined) {
            if (fechageneracion === null) {
                parsedFecha = null;
            } else {
                const d = new Date(fechageneracion);
                if (!isNaN(d.getTime())) parsedFecha = d;
            }
        }

        return [
            undefined,
            new UpdateAcumuladoDecimoPrimerMesDto(
                parsedId,
                parsedEmpleadoId,
                parsedPeriodoId,
                salariobruto != null ? Number(salariobruto) : undefined,
                montoacumulado != null ? Number(montoacumulado) : undefined,
                montopagado != null ? Number(montopagado) : undefined,
                parsedFecha
            )
        ];
    }
}
