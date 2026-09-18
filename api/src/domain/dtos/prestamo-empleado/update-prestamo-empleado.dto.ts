export class UpdatePrestamoEmpleadoDto {

    private constructor(
        public readonly id: number,
        public readonly empleadoid?: number,
        public readonly monto?: number,
        public readonly numerocuotas?: number,
        public readonly montocuota?: number,
        public readonly fechadesembolso?: Date,
        public readonly montopagado?: number,
        public readonly motivo?: string | null,
        public readonly estado?: string,
        public readonly usuarioid?: number | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.monto != null) returnObj.monto = this.monto;
        if (this.numerocuotas != null) returnObj.numerocuotas = this.numerocuotas;
        if (this.montocuota != null) returnObj.montocuota = this.montocuota;
        if (this.fechadesembolso !== undefined) returnObj.fechadesembolso = this.fechadesembolso;
        if (this.montopagado != null) returnObj.montopagado = this.montopagado;
        if (this.motivo !== undefined) returnObj.motivo = this.motivo;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.usuarioid !== undefined) returnObj.usuarioid = this.usuarioid;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdatePrestamoEmpleadoDto?] {
        const {
            id,
            empleadoid,
            numerocuotas,
            montocuota,
            montopagado,
            estado,
            usuarioid
        } = props;
        const monto = props.monto ?? props.montoprestamo;
        const fechadesembolso = props.fechadesembolso ?? props.fechainicio;
        const motivo = props.motivo ?? props.observaciones;

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

        let parsedDesembolso: Date | undefined;
        if (fechadesembolso !== undefined) {
            const d = new Date(fechadesembolso);
            if (isNaN(d.getTime())) return ['La fecha de desembolso es inválida', undefined];
            parsedDesembolso = d;
        }

        return [
            undefined,
            new UpdatePrestamoEmpleadoDto(
                parsedId,
                parsedEmpleadoId,
                monto != null ? Number(monto) : undefined,
                numerocuotas != null ? Number(numerocuotas) : undefined,
                montocuota != null ? Number(montocuota) : undefined,
                parsedDesembolso,
                montopagado != null ? Number(montopagado) : undefined,
                motivo !== undefined ? (motivo ? String(motivo).trim() : null) : undefined,
                estado ? String(estado).trim().toUpperCase() : undefined,
                usuarioid !== undefined ? (usuarioid != null ? Number(usuarioid) : null) : undefined
            )
        ];
    }
}
