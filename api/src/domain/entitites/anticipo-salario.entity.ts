export class AnticipoSalarioEntity {

    constructor(
        public readonly id: number,
        public readonly empleadoid: number,
        public readonly monto: number,
        public readonly fechaanticipoid: Date,
        public readonly estado: string = 'PENDIENTE',
        public readonly descontadoenperiodoid?: number | null,
        public readonly usuarioid?: number | null,
        public readonly empleadonombre?: string | null,
        public readonly periodonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): AnticipoSalarioEntity {
        const id = object.id ?? object.anticipoid;
        const fechaanticipoid = object.fechaanticipoid ?? object.fechaanticipo ?? object.fecha;
        const descontadoenperiodoid = object.descontadoenperiodoid ?? object.periodoid ?? null;
        const { empleadoid, monto, estado, usuarioid } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (monto == null) throw 'Monto es obligatorio';
        if (!fechaanticipoid) throw 'Fecha de anticipo es obligatoria';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);
        const periodonombre = object.periodosplanilla?.tipoperiodo ?? object.periodonombre ?? null;

        return new AnticipoSalarioEntity(
            Number(id),
            Number(empleadoid),
            Number(monto),
            new Date(fechaanticipoid),
            estado || 'PENDIENTE',
            descontadoenperiodoid != null ? Number(descontadoenperiodoid) : null,
            usuarioid != null ? Number(usuarioid) : null,
            empleadonombre,
            periodonombre
        );
    }
}
