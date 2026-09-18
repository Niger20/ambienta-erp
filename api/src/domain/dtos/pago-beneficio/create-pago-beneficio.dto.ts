export class CreatePagoBeneficioDto {

    private constructor(
        public readonly empleadoid: number,
        public readonly tipobeneficio: string,
        public readonly montopagado: number,
        public readonly fechapago: Date,
        public readonly periodoid?: number | null,
        public readonly observaciones?: string | null,
        public readonly usuarioid?: number | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreatePagoBeneficioDto?] {
        const montopagado = props.montopagado ?? props.monto;
        const { empleadoid, tipobeneficio, fechapago, periodoid, observaciones, usuarioid } = props;

        if (empleadoid == null) return ['El empleado ID es obligatorio', undefined];
        const parsedEmpleadoId = Number(empleadoid);
        if (Number.isNaN(parsedEmpleadoId) || !Number.isInteger(parsedEmpleadoId)) {
            return ['El empleado ID debe ser un número entero válido', undefined];
        }

        if (!tipobeneficio || typeof tipobeneficio !== 'string') return ['El tipo de beneficio es obligatorio', undefined];

        if (montopagado == null) return ['El monto pagado es obligatorio', undefined];
        const parsedMonto = Number(montopagado);
        if (Number.isNaN(parsedMonto) || parsedMonto <= 0) return ['El monto pagado debe ser mayor a cero', undefined];

        if (!fechapago) return ['La fecha de pago es obligatoria', undefined];
        const parsedPago = new Date(fechapago);
        if (isNaN(parsedPago.getTime())) return ['La fecha de pago es inválida', undefined];

        return [
            undefined,
            new CreatePagoBeneficioDto(
                parsedEmpleadoId,
                tipobeneficio.trim().toUpperCase(),
                parsedMonto,
                parsedPago,
                periodoid != null ? Number(periodoid) : null,
                observaciones ? String(observaciones).trim() : null,
                usuarioid != null ? Number(usuarioid) : null
            )
        ];
    }
}
