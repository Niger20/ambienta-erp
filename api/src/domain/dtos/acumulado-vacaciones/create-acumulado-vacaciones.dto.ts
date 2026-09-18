export class CreateAcumuladoVacacionesDto {

    private constructor(
        public readonly empleadoid: number,
        public readonly periodoid: number,
        public readonly diasganados: number,
        public readonly valordiasalario: number,
        public readonly montoganado: number,
        public readonly diasdisfrutados: number = 0,
        public readonly montopagado: number = 0,
        public readonly fechageneracion?: Date | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateAcumuladoVacacionesDto?] {
        const {
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

        if (empleadoid == null) return ['El empleado ID es obligatorio', undefined];
        const parsedEmpleadoId = Number(empleadoid);
        if (Number.isNaN(parsedEmpleadoId) || !Number.isInteger(parsedEmpleadoId)) {
            return ['El empleado ID debe ser un número entero válido', undefined];
        }

        if (periodoid == null) return ['El período ID es obligatorio', undefined];
        const parsedPeriodoId = Number(periodoid);
        if (Number.isNaN(parsedPeriodoId) || !Number.isInteger(parsedPeriodoId)) {
            return ['El período ID debe ser un número entero válido', undefined];
        }

        const parsedDiasGanados = diasganados != null ? Number(diasganados) : 2.5;
        const parsedValorDia = valordiasalario != null ? Number(valordiasalario) : (salariobruto != null ? Number(salariobruto) / 30 : 0);
        const parsedMontoGanado = montoganado != null ? Number(montoganado) : (montoacumulado != null ? Number(montoacumulado) : (parsedDiasGanados * parsedValorDia));
        const parsedDisfrutados = diasdisfrutados != null ? Number(diasdisfrutados) : (diasgozados != null ? Number(diasgozados) : 0);
        const parsedPagado = montopagado != null ? Number(montopagado) : 0;

        let parsedFecha: Date | null = null;
        if (fechageneracion) {
            const d = new Date(fechageneracion);
            if (!isNaN(d.getTime())) parsedFecha = d;
        }

        return [
            undefined,
            new CreateAcumuladoVacacionesDto(
                parsedEmpleadoId,
                parsedPeriodoId,
                parsedDiasGanados,
                parsedValorDia,
                parsedMontoGanado,
                parsedDisfrutados,
                parsedPagado,
                parsedFecha
            )
        ];
    }
}
