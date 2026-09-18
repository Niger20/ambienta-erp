export class AcumuladoIndemnizacionEntity {

    constructor(
        public readonly id: number,
        public readonly empleadoid: number,
        public readonly periodoid: number,
        public readonly salariobruto: number,
        public readonly montoacumulado: number,
        public readonly fechageneracion?: Date | null,
        public readonly empleadonombre?: string | null,
        public readonly periodonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): AcumuladoIndemnizacionEntity {
        const id = object.id ?? object.acumuladoindemnid ?? object.acumuladoid;
        const { empleadoid, periodoid, salariobruto, montoacumulado, fechageneracion } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (periodoid == null) throw 'Período ID es obligatorio';
        if (salariobruto == null) throw 'Salario bruto es obligatorio';
        if (montoacumulado == null) throw 'Monto acumulado es obligatorio';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);
        const periodonombre = object.periodosplanilla?.tipoperiodo ?? object.periodonombre ?? null;

        return new AcumuladoIndemnizacionEntity(
            Number(id),
            Number(empleadoid),
            Number(periodoid),
            Number(salariobruto),
            Number(montoacumulado),
            fechageneracion ? new Date(fechageneracion) : null,
            empleadonombre,
            periodonombre
        );
    }
}
