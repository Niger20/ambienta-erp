export class CreateAcumuladoIndemnizacionDto {

    private constructor(
        public readonly empleadoid: number,
        public readonly periodoid: number,
        public readonly salariobruto: number,
        public readonly montoacumulado: number,
        public readonly fechageneracion?: Date | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateAcumuladoIndemnizacionDto?] {
        const { empleadoid, periodoid, salariobruto, montoacumulado, fechageneracion } = props;

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

        if (salariobruto == null) return ['El salario bruto es obligatorio', undefined];
        const parsedSalario = Number(salariobruto);
        if (Number.isNaN(parsedSalario) || parsedSalario < 0) return ['El salario bruto debe ser un número válido', undefined];

        const parsedAcumulado = montoacumulado != null ? Number(montoacumulado) : (parsedSalario / 12);

        let parsedFecha: Date | null = null;
        if (fechageneracion) {
            const d = new Date(fechageneracion);
            if (!isNaN(d.getTime())) parsedFecha = d;
        }

        return [
            undefined,
            new CreateAcumuladoIndemnizacionDto(
                parsedEmpleadoId,
                parsedPeriodoId,
                parsedSalario,
                parsedAcumulado,
                parsedFecha
            )
        ];
    }
}
