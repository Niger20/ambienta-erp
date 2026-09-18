export class CreateAnticipoSalarioDto {

    private constructor(
        public readonly empleadoid: number,
        public readonly monto: number,
        public readonly fechaanticipoid: Date,
        public readonly estado: string = 'PENDIENTE',
        public readonly descontadoenperiodoid?: number | null,
        public readonly usuarioid?: number | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateAnticipoSalarioDto?] {
        const fechaanticipoid = props.fechaanticipoid ?? props.fechaanticipo ?? props.fecha;
        const descontadoenperiodoid = props.descontadoenperiodoid ?? props.periodoid;
        const { empleadoid, monto, estado, usuarioid } = props;

        if (empleadoid == null) return ['El empleado ID es obligatorio', undefined];
        const parsedEmpleadoId = Number(empleadoid);
        if (Number.isNaN(parsedEmpleadoId) || !Number.isInteger(parsedEmpleadoId)) {
            return ['El empleado ID debe ser un número entero válido', undefined];
        }

        if (monto == null) return ['El monto es obligatorio', undefined];
        const parsedMonto = Number(monto);
        if (Number.isNaN(parsedMonto) || parsedMonto <= 0) return ['El monto debe ser mayor a cero', undefined];

        let parsedFecha = new Date();
        if (fechaanticipoid) {
            const d = new Date(fechaanticipoid);
            if (isNaN(d.getTime())) return ['La fecha de anticipo es inválida', undefined];
            parsedFecha = d;
        }

        const parsedPeriodoId = descontadoenperiodoid != null ? Number(descontadoenperiodoid) : null;

        return [
            undefined,
            new CreateAnticipoSalarioDto(
                parsedEmpleadoId,
                parsedMonto,
                parsedFecha,
                estado ? String(estado).trim().toUpperCase() : 'PENDIENTE',
                parsedPeriodoId,
                usuarioid != null ? Number(usuarioid) : null
            )
        ];
    }
}
