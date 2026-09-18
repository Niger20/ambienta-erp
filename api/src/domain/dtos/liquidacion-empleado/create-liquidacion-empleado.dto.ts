export class CreateLiquidacionEmpleadoDto {

    private constructor(
        public readonly empleadoid: number,
        public readonly fechaliquidacion: Date,
        public readonly tiposalida: string,
        public readonly salariobrutobase: number,
        public readonly diaslaborados: number,
        public readonly vacacionespagadas: number = 0,
        public readonly decimotercerpagado: number = 0,
        public readonly indemnizacionpagada: number = 0,
        public readonly salariosatrasados: number = 0,
        public readonly otrosbeneficios: number = 0,
        public readonly prestamosdescontados: number = 0,
        public readonly anticiposdescontados: number = 0,
        public readonly otrasdeduccionesliq: number = 0,
        public readonly estado: string = 'BORRADOR',
        public readonly usuarioid?: number | null,
        public readonly observaciones?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateLiquidacionEmpleadoDto?] {
        const fechaliquidacion = props.fechaliquidacion ?? props.fechafincontrato ?? props.fechapago;
        const tiposalida = props.tiposalida ?? props.motivoliquidacion ?? 'RENUNCIA';
        const salariobrutobase = props.salariobrutobase ?? props.salariopromedio ?? 0;
        const diaslaborados = props.diaslaborados ?? props.anioslaborados ?? 0;
        const vacacionespagadas = props.vacacionespagadas ?? props.montovacacionespendientes ?? 0;
        const decimotercerpagado = props.decimotercerpagado ?? props.montodecimonotercero ?? 0;
        const indemnizacionpagada = props.indemnizacionpagada ?? props.montoindemnizacion ?? 0;
        const {
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

        if (empleadoid == null) return ['El empleado ID es obligatorio', undefined];
        const parsedEmpleadoId = Number(empleadoid);
        if (Number.isNaN(parsedEmpleadoId) || !Number.isInteger(parsedEmpleadoId)) {
            return ['El empleado ID debe ser un número entero válido', undefined];
        }

        if (!fechaliquidacion) return ['La fecha de liquidación es obligatoria', undefined];
        const parsedFecha = new Date(fechaliquidacion);
        if (isNaN(parsedFecha.getTime())) return ['La fecha de liquidación es inválida', undefined];

        return [
            undefined,
            new CreateLiquidacionEmpleadoDto(
                parsedEmpleadoId,
                parsedFecha,
                String(tiposalida).trim().toUpperCase(),
                Number(salariobrutobase) || 0,
                Number(diaslaborados) || 0,
                Number(vacacionespagadas) || 0,
                Number(decimotercerpagado) || 0,
                Number(indemnizacionpagada) || 0,
                Number(salariosatrasados) || 0,
                Number(otrosbeneficios) || 0,
                Number(prestamosdescontados) || 0,
                Number(anticiposdescontados) || 0,
                Number(otrasdeduccionesliq) || 0,
                estado ? String(estado).trim().toUpperCase() : 'BORRADOR',
                usuarioid != null ? Number(usuarioid) : null,
                observaciones ? String(observaciones).trim() : null
            )
        ];
    }
}
