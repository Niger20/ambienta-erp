export class RegistroAsistenciaEntity {

    constructor(
        public readonly id: number,
        public readonly empleadoid: number,
        public readonly fecha: Date,
        public readonly horaentrada?: Date | null,
        public readonly horasalida?: Date | null,
        public readonly horastrabajadas?: number | null,
        public readonly horasextra: number = 0,
        public readonly tipoausencia?: string | null,
        public readonly observaciones?: string | null,
        public readonly empleadonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): RegistroAsistenciaEntity {
        const id = object.id ?? object.asistenciaid;
        const {
            empleadoid,
            fecha,
            horaentrada,
            horasalida,
            horastrabajadas,
            horasextra,
            tipoausencia,
            observaciones
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (!fecha) throw 'Fecha es obligatoria';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);

        return new RegistroAsistenciaEntity(
            Number(id),
            Number(empleadoid),
            new Date(fecha),
            horaentrada ? new Date(horaentrada) : null,
            horasalida ? new Date(horasalida) : null,
            horastrabajadas != null ? Number(horastrabajadas) : null,
            horasextra != null ? Number(horasextra) : 0,
            tipoausencia ?? null,
            observaciones ?? null,
            empleadonombre
        );
    }
}
