export class UpdatePagoBeneficioDto {

    private constructor(
        public readonly id: number,
        public readonly empleadoid?: number,
        public readonly tipobeneficio?: string,
        public readonly montopagado?: number,
        public readonly fechapago?: Date,
        public readonly periodoid?: number | null,
        public readonly observaciones?: string | null,
        public readonly usuarioid?: number | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.tipobeneficio != null) returnObj.tipobeneficio = this.tipobeneficio;
        if (this.montopagado != null) returnObj.montopagado = this.montopagado;
        if (this.fechapago !== undefined) returnObj.fechapago = this.fechapago;
        if (this.periodoid !== undefined) returnObj.periodoid = this.periodoid;
        if (this.observaciones !== undefined) returnObj.observaciones = this.observaciones;
        if (this.usuarioid !== undefined) returnObj.usuarioid = this.usuarioid;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdatePagoBeneficioDto?] {
        const { id, empleadoid, tipobeneficio, fechapago, periodoid, observaciones, usuarioid } = props;
        const montopagado = props.montopagado ?? props.monto;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedEmpleadoId: number | undefined;
        if (empleadoid != null) {
            const parsed = Number(empleadoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El empleado ID debe ser un número entero válido', undefined];
            }
            parsedEmpleadoId = parsed;
        }

        let parsedPago: Date | undefined;
        if (fechapago !== undefined) {
            const d = new Date(fechapago);
            if (isNaN(d.getTime())) return ['La fecha de pago es inválida', undefined];
            parsedPago = d;
        }

        return [
            undefined,
            new UpdatePagoBeneficioDto(
                parsedId,
                parsedEmpleadoId,
                tipobeneficio ? String(tipobeneficio).trim().toUpperCase() : undefined,
                montopagado != null ? Number(montopagado) : undefined,
                parsedPago,
                periodoid !== undefined ? (periodoid != null ? Number(periodoid) : null) : undefined,
                observaciones !== undefined ? (observaciones ? String(observaciones).trim() : null) : undefined,
                usuarioid !== undefined ? (usuarioid != null ? Number(usuarioid) : null) : undefined
            )
        ];
    }
}
