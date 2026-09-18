export class UpdateLiquidacionEmpleadoDto {

    private constructor(
        public readonly id: number,
        public readonly empleadoid?: number,
        public readonly fechaliquidacion?: Date,
        public readonly tiposalida?: string,
        public readonly salariobrutobase?: number,
        public readonly diaslaborados?: number,
        public readonly vacacionespagadas?: number,
        public readonly decimotercerpagado?: number,
        public readonly indemnizacionpagada?: number,
        public readonly salariosatrasados?: number,
        public readonly otrosbeneficios?: number,
        public readonly prestamosdescontados?: number,
        public readonly anticiposdescontados?: number,
        public readonly otrasdeduccionesliq?: number,
        public readonly estado?: string,
        public readonly usuarioid?: number | null,
        public readonly observaciones?: string | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.fechaliquidacion !== undefined) returnObj.fechaliquidacion = this.fechaliquidacion;
        if (this.tiposalida != null) returnObj.tiposalida = this.tiposalida;
        if (this.salariobrutobase != null) returnObj.salariobrutobase = this.salariobrutobase;
        if (this.diaslaborados != null) returnObj.diaslaborados = this.diaslaborados;
        if (this.vacacionespagadas != null) returnObj.vacacionespagadas = this.vacacionespagadas;
        if (this.decimotercerpagado != null) returnObj.decimotercerpagado = this.decimotercerpagado;
        if (this.indemnizacionpagada != null) returnObj.indemnizacionpagada = this.indemnizacionpagada;
        if (this.salariosatrasados != null) returnObj.salariosatrasados = this.salariosatrasados;
        if (this.otrosbeneficios != null) returnObj.otrosbeneficios = this.otrosbeneficios;
        if (this.prestamosdescontados != null) returnObj.prestamosdescontados = this.prestamosdescontados;
        if (this.anticiposdescontados != null) returnObj.anticiposdescontados = this.anticiposdescontados;
        if (this.otrasdeduccionesliq != null) returnObj.otrasdeduccionesliq = this.otrasdeduccionesliq;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.usuarioid !== undefined) returnObj.usuarioid = this.usuarioid;
        if (this.observaciones !== undefined) returnObj.observaciones = this.observaciones;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateLiquidacionEmpleadoDto?] {
        const {
            id,
            empleadoid,
            salariosatrasados,
            otrosbeneficios,
            prestamosdescontados,
            anticiposdescontados,
            otrasdeduccionesliq,
            estado,
            usuarioid,
            observaciones
        } = props;
        const fechaliquidacion = props.fechaliquidacion ?? props.fechafincontrato ?? props.fechapago;
        const tiposalida = props.tiposalida ?? props.motivoliquidacion;
        const salariobrutobase = props.salariobrutobase ?? props.salariopromedio;
        const diaslaborados = props.diaslaborados ?? props.anioslaborados;
        const vacacionespagadas = props.vacacionespagadas ?? props.montovacacionespendientes;
        const decimotercerpagado = props.decimotercerpagado ?? props.montodecimonotercero;
        const indemnizacionpagada = props.indemnizacionpagada ?? props.montoindemnizacion;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedEmpleadoId: number | undefined;
        if (empleadoid != null) {
            const parsed = Number(empleadoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) return ['El empleado ID debe ser un entero válido', undefined];
            parsedEmpleadoId = parsed;
        }

        let parsedFecha: Date | undefined;
        if (fechaliquidacion !== undefined) {
            const d = new Date(fechaliquidacion);
            if (isNaN(d.getTime())) return ['La fecha de liquidación es inválida', undefined];
            parsedFecha = d;
        }

        return [
            undefined,
            new UpdateLiquidacionEmpleadoDto(
                parsedId,
                parsedEmpleadoId,
                parsedFecha,
                tiposalida ? String(tiposalida).trim().toUpperCase() : undefined,
                salariobrutobase != null ? Number(salariobrutobase) : undefined,
                diaslaborados != null ? Number(diaslaborados) : undefined,
                vacacionespagadas != null ? Number(vacacionespagadas) : undefined,
                decimotercerpagado != null ? Number(decimotercerpagado) : undefined,
                indemnizacionpagada != null ? Number(indemnizacionpagada) : undefined,
                salariosatrasados != null ? Number(salariosatrasados) : undefined,
                otrosbeneficios != null ? Number(otrosbeneficios) : undefined,
                prestamosdescontados != null ? Number(prestamosdescontados) : undefined,
                anticiposdescontados != null ? Number(anticiposdescontados) : undefined,
                otrasdeduccionesliq != null ? Number(otrasdeduccionesliq) : undefined,
                estado ? String(estado).trim().toUpperCase() : undefined,
                usuarioid !== undefined ? (usuarioid != null ? Number(usuarioid) : null) : undefined,
                observaciones !== undefined ? (observaciones ? String(observaciones).trim() : null) : undefined
            )
        ];
    }
}
