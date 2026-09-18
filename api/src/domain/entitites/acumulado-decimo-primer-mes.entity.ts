export class AcumuladoDecimoPrimerMesEntity {

    constructor(
        public readonly id: number,
        public readonly empleadoid: number,
        public readonly periodoid: number,
        public readonly salariobruto: number,
        public readonly montoacumulado: number,
        public readonly montopagado: number = 0,
        public readonly fechageneracion?: Date | null,
        public readonly empleadonombre?: string | null,
        public readonly periodonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): AcumuladoDecimoPrimerMesEntity {
        const id = object.id ?? object.acumuladodecimoid ?? object.acumuladoid;
        const { empleadoid, periodoid, salariobruto, montoacumulado, montopagado, fechageneracion } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (periodoid == null) throw 'Período ID es obligatorio';
        if (salariobruto == null) throw 'Salario bruto es obligatorio';
        if (montoacumulado == null) throw 'Monto acumulado es obligatorio';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);
        const periodonombre = object.periodosplanilla?.tipoperiodo ?? object.periodonombre ?? null;

        return new AcumuladoDecimoPrimerMesEntity(
            Number(id),
            Number(empleadoid),
            Number(periodoid),
            Number(salariobruto),
            Number(montoacumulado),
            montopagado != null ? Number(montopagado) : 0,
            fechageneracion ? new Date(fechageneracion) : null,
            empleadonombre,
            periodonombre
        );
    }
}
