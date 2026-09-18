export class LiquidacionEmpleadoEntity {

    constructor(
        public readonly id: number,
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
        public readonly totalbruto?: number | null,
        public readonly totaldescuentos?: number | null,
        public readonly montoneto?: number | null,
        public readonly estado: string = 'BORRADOR',
        public readonly usuarioid?: number | null,
        public readonly observaciones?: string | null,
        public readonly empleadonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): LiquidacionEmpleadoEntity {
        const id = object.id ?? object.liquidacionid;
        const fechaliquidacion = object.fechaliquidacion ?? object.fechafincontrato ?? object.fechapago;
        const tiposalida = object.tiposalida ?? object.motivoliquidacion ?? 'RENUNCIA';
        const salariobrutobase = object.salariobrutobase ?? object.salariopromedio ?? 0;
        const diaslaborados = object.diaslaborados ?? object.anioslaborados ?? 0;
        const vacacionespagadas = object.vacacionespagadas ?? object.montovacacionespendientes ?? 0;
        const decimotercerpagado = object.decimotercerpagado ?? object.montodecimonotercero ?? 0;
        const indemnizacionpagada = object.indemnizacionpagada ?? object.montoindemnizacion ?? 0;
        const montoneto = object.montoneto ?? object.totalpagar ?? null;
        const {
            empleadoid,
            salariosatrasados,
            otrosbeneficios,
            prestamosdescontados,
            anticiposdescontados,
            otrasdeduccionesliq,
            totalbruto,
            totaldescuentos,
            estado,
            usuarioid,
            observaciones
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (!fechaliquidacion) throw 'Fecha de liquidación es obligatoria';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);

        return new LiquidacionEmpleadoEntity(
            Number(id),
            Number(empleadoid),
            new Date(fechaliquidacion),
            tiposalida,
            Number(salariobrutobase),
            Number(diaslaborados),
            Number(vacacionespagadas),
            Number(decimotercerpagado),
            Number(indemnizacionpagada),
            salariosatrasados != null ? Number(salariosatrasados) : 0,
            otrosbeneficios != null ? Number(otrosbeneficios) : 0,
            prestamosdescontados != null ? Number(prestamosdescontados) : 0,
            anticiposdescontados != null ? Number(anticiposdescontados) : 0,
            otrasdeduccionesliq != null ? Number(otrasdeduccionesliq) : 0,
            totalbruto != null ? Number(totalbruto) : null,
            totaldescuentos != null ? Number(totaldescuentos) : null,
            montoneto != null ? Number(montoneto) : null,
            estado || 'BORRADOR',
            usuarioid != null ? Number(usuarioid) : null,
            observaciones ?? null,
            empleadonombre
        );
    }
}
