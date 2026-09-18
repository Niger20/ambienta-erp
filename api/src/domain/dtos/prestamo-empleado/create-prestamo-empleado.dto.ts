export class CreatePrestamoEmpleadoDto {

    private constructor(
        public readonly empleadoid: number,
        public readonly monto: number,
        public readonly numerocuotas: number,
        public readonly montocuota: number,
        public readonly fechadesembolso: Date,
        public readonly motivo?: string | null,
        public readonly estado: string = 'ACTIVO',
        public readonly usuarioid?: number | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreatePrestamoEmpleadoDto?] {
        const monto = props.monto ?? props.montoprestamo;
        const fechadesembolso = props.fechadesembolso ?? props.fechainicio;
        const motivo = props.motivo ?? props.observaciones;
        const {
            empleadoid,
            numerocuotas,
            montocuota,
            estado,
            usuarioid
        } = props;

        if (empleadoid == null) return ['El empleado ID es obligatorio', undefined];
        const parsedEmpleadoId = Number(empleadoid);
        if (Number.isNaN(parsedEmpleadoId) || !Number.isInteger(parsedEmpleadoId)) {
            return ['El empleado ID debe ser un número entero válido', undefined];
        }

        if (monto == null) return ['El monto es obligatorio', undefined];
        const parsedMonto = Number(monto);
        if (Number.isNaN(parsedMonto) || parsedMonto <= 0) return ['El monto debe ser mayor a cero', undefined];

        if (numerocuotas == null) return ['El número de cuotas es obligatorio', undefined];
        const parsedCuotas = Number(numerocuotas);
        if (Number.isNaN(parsedCuotas) || !Number.isInteger(parsedCuotas) || parsedCuotas <= 0) {
            return ['El número de cuotas debe ser un entero mayor a cero', undefined];
        }

        const parsedMontoCuota = montocuota != null ? Number(montocuota) : (parsedMonto / parsedCuotas);

        let parsedDesembolso = new Date();
        if (fechadesembolso) {
            const d = new Date(fechadesembolso);
            if (isNaN(d.getTime())) return ['La fecha de desembolso es inválida', undefined];
            parsedDesembolso = d;
        }

        return [
            undefined,
            new CreatePrestamoEmpleadoDto(
                parsedEmpleadoId,
                parsedMonto,
                parsedCuotas,
                parsedMontoCuota,
                parsedDesembolso,
                motivo ? String(motivo).trim() : null,
                estado ? String(estado).trim().toUpperCase() : 'ACTIVO',
                usuarioid != null ? Number(usuarioid) : null
            )
        ];
    }
}
