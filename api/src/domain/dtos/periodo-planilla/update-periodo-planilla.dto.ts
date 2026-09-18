export class UpdatePeriodoPlanillaDto {

    private constructor(
        public readonly id: number,
        public readonly fechainicio?: Date,
        public readonly fechafin?: Date,
        public readonly tipoperiodo?: string,
        public readonly fechapago?: Date | null,
        public readonly estado?: string,
        public readonly observaciones?: string | null,
        public readonly usuarioaprobacionid?: number | null,
        public readonly fechaaprobacion?: Date | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.tipoperiodo != null) returnObj.tipoperiodo = this.tipoperiodo;
        if (this.fechainicio !== undefined) returnObj.fechainicio = this.fechainicio;
        if (this.fechafin !== undefined) returnObj.fechafin = this.fechafin;
        if (this.fechapago !== undefined) returnObj.fechapago = this.fechapago;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.observaciones !== undefined) returnObj.observaciones = this.observaciones;
        if (this.usuarioaprobacionid !== undefined) returnObj.usuarioaprobacionid = this.usuarioaprobacionid;
        if (this.fechaaprobacion !== undefined) returnObj.fechaaprobacion = this.fechaaprobacion;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdatePeriodoPlanillaDto?] {
        const { id, fechainicio, fechafin, fechapago, estado, observaciones, usuarioaprobacionid, fechaaprobacion } = props;
        const tipoperiodo = props.tipoperiodo ?? props.nombre;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

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

        let parsedPago: Date | null | undefined;
        if (fechapago !== undefined) {
            if (fechapago === null) {
                parsedPago = null;
            } else {
                const d = new Date(fechapago);
                if (!isNaN(d.getTime())) parsedPago = d;
            }
        }

        return [
            undefined,
            new UpdatePeriodoPlanillaDto(
                parsedId,
                parsedInicio,
                parsedFin,
                tipoperiodo ? String(tipoperiodo).trim().toUpperCase() : undefined,
                parsedPago,
                estado ? String(estado).trim().toUpperCase() : undefined,
                observaciones !== undefined ? (observaciones ? String(observaciones).trim() : null) : undefined,
                usuarioaprobacionid !== undefined ? (usuarioaprobacionid != null ? Number(usuarioaprobacionid) : null) : undefined,
                fechaaprobacion ? new Date(fechaaprobacion) : undefined
            )
        ];
    }
}
