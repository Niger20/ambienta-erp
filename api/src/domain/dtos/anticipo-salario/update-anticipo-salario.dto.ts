export class UpdateAnticipoSalarioDto {

    private constructor(
        public readonly id: number,
        public readonly empleadoid?: number,
        public readonly monto?: number,
        public readonly fechaanticipoid?: Date,
        public readonly descontadoenperiodoid?: number | null,
        public readonly estado?: string,
        public readonly usuarioid?: number | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.monto != null) returnObj.monto = this.monto;
        if (this.fechaanticipoid !== undefined) returnObj.fechaanticipoid = this.fechaanticipoid;
        if (this.descontadoenperiodoid !== undefined) returnObj.descontadoenperiodoid = this.descontadoenperiodoid;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.usuarioid !== undefined) returnObj.usuarioid = this.usuarioid;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateAnticipoSalarioDto?] {
        const { id, empleadoid, monto, estado, usuarioid } = props;
        const fechaanticipoid = props.fechaanticipoid ?? props.fechaanticipo ?? props.fecha;
        const descontadoenperiodoid = props.descontadoenperiodoid ?? props.periodoid;

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

        let parsedFecha: Date | undefined;
        if (fechaanticipoid !== undefined) {
            const d = new Date(fechaanticipoid);
            if (isNaN(d.getTime())) return ['La fecha de anticipo es inválida', undefined];
            parsedFecha = d;
        }

        const parsedPeriodoId = descontadoenperiodoid !== undefined
            ? (descontadoenperiodoid != null ? Number(descontadoenperiodoid) : null)
            : undefined;

        return [
            undefined,
            new UpdateAnticipoSalarioDto(
                parsedId,
                parsedEmpleadoId,
                monto != null ? Number(monto) : undefined,
                parsedFecha,
                parsedPeriodoId,
                estado ? String(estado).trim().toUpperCase() : undefined,
                usuarioid !== undefined ? (usuarioid != null ? Number(usuarioid) : null) : undefined
            )
        ];
    }
}
