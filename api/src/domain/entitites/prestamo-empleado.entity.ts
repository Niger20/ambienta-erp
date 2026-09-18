export class PrestamoEmpleadoEntity {

    constructor(
        public readonly id: number,
        public readonly empleadoid: number,
        public readonly monto: number,
        public readonly numerocuotas: number,
        public readonly montocuota: number,
        public readonly fechadesembolso: Date,
        public readonly montopagado: number = 0,
        public readonly montorestante?: number | null,
        public readonly motivo?: string | null,
        public readonly estado: string = 'ACTIVO',
        public readonly usuarioid?: number | null,
        public readonly empleadonombre?: string | null,
        public readonly cuotas?: any[],
    ) {}

    public static fromObject(object: { [key: string]: any }): PrestamoEmpleadoEntity {
        const id = object.id ?? object.prestamoid;
        const monto = object.monto ?? object.montoprestamo;
        const fechadesembolso = object.fechadesembolso ?? object.fechainicio;
        const motivo = object.motivo ?? object.observaciones;
        const {
            empleadoid,
            numerocuotas,
            montocuota,
            montopagado,
            montorestante,
            estado,
            usuarioid,
            cuotasprestamos
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (monto == null) throw 'Monto es obligatorio';
        if (numerocuotas == null) throw 'Número de cuotas es obligatorio';
        if (montocuota == null) throw 'Monto de cuota es obligatorio';
        if (!fechadesembolso) throw 'Fecha de desembolso es obligatoria';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);

        return new PrestamoEmpleadoEntity(
            Number(id),
            Number(empleadoid),
            Number(monto),
            Number(numerocuotas),
            Number(montocuota),
            new Date(fechadesembolso),
            montopagado != null ? Number(montopagado) : 0,
            montorestante != null ? Number(montorestante) : (Number(monto) - (montopagado != null ? Number(montopagado) : 0)),
            motivo ?? null,
            estado || 'ACTIVO',
            usuarioid != null ? Number(usuarioid) : null,
            empleadonombre,
            cuotasprestamos
        );
    }
}
