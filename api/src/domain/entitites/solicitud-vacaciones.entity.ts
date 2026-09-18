export class SolicitudVacacionesEntity {

    constructor(
        public readonly id: number,
        public readonly empleadoid: number,
        public readonly fechainicio: Date,
        public readonly fechafin: Date,
        public readonly diashabiles: number,
        public readonly estado: string = 'PENDIENTE',
        public readonly observaciones?: string | null,
        public readonly usuarioaprobacionid?: number | null,
        public readonly fechaaprobacion?: Date | null,
        public readonly empleadonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): SolicitudVacacionesEntity {
        const id = object.id ?? object.solicitudvacid ?? object.solicitudid;
        const {
            empleadoid,
            fechainicio,
            fechafin,
            diashabiles,
            dias,
            estado,
            observaciones,
            usuarioaprobacionid,
            fechaaprobacion
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (!fechainicio) throw 'Fecha de inicio es obligatoria';
        if (!fechafin) throw 'Fecha de fin es obligatoria';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);
        const parsedDias = diashabiles != null ? Number(diashabiles) : (dias != null ? Number(dias) : 1);

        return new SolicitudVacacionesEntity(
            Number(id),
            Number(empleadoid),
            new Date(fechainicio),
            new Date(fechafin),
            parsedDias,
            estado || 'PENDIENTE',
            observaciones ?? null,
            usuarioaprobacionid != null ? Number(usuarioaprobacionid) : null,
            fechaaprobacion ? new Date(fechaaprobacion) : null,
            empleadonombre
        );
    }
}
