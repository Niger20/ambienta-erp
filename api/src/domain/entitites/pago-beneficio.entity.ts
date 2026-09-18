export class PagoBeneficioEntity {

    constructor(
        public readonly id: number,
        public readonly empleadoid: number,
        public readonly tipobeneficio: string,
        public readonly montopagado: number,
        public readonly fechapago: Date,
        public readonly periodoid?: number | null,
        public readonly observaciones?: string | null,
        public readonly usuarioid?: number | null,
        public readonly empleadonombre?: string | null,
        public readonly periodonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): PagoBeneficioEntity {
        const id = object.id ?? object.pagobeneficioid ?? object.beneficioid;
        const montopagado = object.montopagado ?? object.monto;
        const { empleadoid, tipobeneficio, fechapago, periodoid, observaciones, usuarioid } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (!tipobeneficio) throw 'Tipo de beneficio es obligatorio';
        if (montopagado == null) throw 'Monto pagado es obligatorio';
        if (!fechapago) throw 'Fecha de pago es obligatoria';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);
        const periodonombre = object.periodosplanilla?.tipoperiodo ?? object.periodonombre ?? null;

        return new PagoBeneficioEntity(
            Number(id),
            Number(empleadoid),
            tipobeneficio,
            Number(montopagado),
            new Date(fechapago),
            periodoid != null ? Number(periodoid) : null,
            observaciones ?? null,
            usuarioid != null ? Number(usuarioid) : null,
            empleadonombre,
            periodonombre
        );
    }
}
