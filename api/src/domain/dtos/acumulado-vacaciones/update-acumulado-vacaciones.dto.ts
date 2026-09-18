export class UpdateAcumuladoVacacionesDto {

    private constructor(
        public readonly id: number,
        public readonly empleadoid?: number,
        public readonly periodoid?: number,
        public readonly diasganados?: number,
        public readonly valordiasalario?: number,
        public readonly montoganado?: number,
        public readonly diasdisfrutados?: number,
        public readonly montopagado?: number,
        public readonly fechageneracion?: Date | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.periodoid != null) returnObj.periodoid = this.periodoid;
        if (this.diasganados != null) returnObj.diasganados = this.diasganados;
        if (this.valordiasalario != null) returnObj.valordiasalario = this.valordiasalario;
        if (this.montoganado != null) returnObj.montoganado = this.montoganado;
        if (this.diasdisfrutados != null) returnObj.diasdisfrutados = this.diasdisfrutados;
        if (this.montopagado != null) returnObj.montopagado = this.montopagado;
        if (this.fechageneracion !== undefined) returnObj.fechageneracion = this.fechageneracion;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateAcumuladoVacacionesDto?] {
        const {
            id,
            empleadoid,
            periodoid,
            diasganados,
            valordiasalario,
            salariobruto,
            montoganado,
            montoacumulado,
            diasdisfrutados,
            diasgozados,
            montopagado,
            fechageneracion
        } = props;

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

        const valorDia = valordiasalario != null ? Number(valordiasalario) : (salariobruto != null ? Number(salariobruto) / 30 : undefined);
        const montoGan = montoganado != null ? Number(montoganado) : (montoacumulado != null ? Number(montoacumulado) : undefined);
        const disfrutados = diasdisfrutados != null ? Number(diasdisfrutados) : (diasgozados != null ? Number(diasgozados) : undefined);

        return [
            undefined,
            new UpdateAcumuladoVacacionesDto(
                parsedId,
                parsedEmpleadoId,
                parsedPeriodoId,
                diasganados != null ? Number(diasganados) : undefined,
                valorDia,
                montoGan,
                disfrutados,
                montopagado != null ? Number(montopagado) : undefined,
                parsedFecha
            )
        ];
    }
}
