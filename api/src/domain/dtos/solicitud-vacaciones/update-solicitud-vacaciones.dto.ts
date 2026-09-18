export class UpdateSolicitudVacacionesDto {

    private constructor(
        public readonly id: number,
        public readonly empleadoid?: number,
        public readonly fechainicio?: Date,
        public readonly fechafin?: Date,
        public readonly diashabiles?: number,
        public readonly estado?: string,
        public readonly observaciones?: string | null,
        public readonly usuarioaprobacionid?: number | null,
        public readonly fechaaprobacion?: Date | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.fechainicio !== undefined) returnObj.fechainicio = this.fechainicio;
        if (this.fechafin !== undefined) returnObj.fechafin = this.fechafin;
        if (this.diashabiles != null) returnObj.diashabiles = this.diashabiles;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.observaciones !== undefined) returnObj.observaciones = this.observaciones;
        if (this.usuarioaprobacionid !== undefined) returnObj.usuarioaprobacionid = this.usuarioaprobacionid;
        if (this.fechaaprobacion !== undefined) returnObj.fechaaprobacion = this.fechaaprobacion;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateSolicitudVacacionesDto?] {
        const {
            id,
            empleadoid,
            fechainicio,
            fechafin,
            diashabiles,
            dias,
            estado,
            observaciones,
            usuarioaprobacionid,
            fechaaprobacion
        } = props;

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

        let parsedInicio: Date | undefined;
        if (fechainicio !== undefined) {
            const d = new Date(fechainicio);
            if (isNaN(d.getTime())) return ['La fecha de inicio es inválida', undefined];
            parsedInicio = d;
        }

        let parsedFin: Date | undefined;
        if (fechafin !== undefined) {
            const d = new Date(fechafin);
            if (isNaN(d.getTime())) return ['La fecha de fin es inválida', undefined];
            parsedFin = d;
        }

        const parsedDias = diashabiles != null ? Number(diashabiles) : (dias != null ? Number(dias) : undefined);

        return [
            undefined,
            new UpdateSolicitudVacacionesDto(
                parsedId,
                parsedEmpleadoId,
                parsedInicio,
                parsedFin,
                parsedDias,
                estado ? String(estado).trim().toUpperCase() : undefined,
                observaciones !== undefined ? (observaciones ? String(observaciones).trim() : null) : undefined,
                usuarioaprobacionid !== undefined ? (usuarioaprobacionid != null ? Number(usuarioaprobacionid) : null) : undefined,
                fechaaprobacion ? new Date(fechaaprobacion) : undefined
            )
        ];
    }
}
