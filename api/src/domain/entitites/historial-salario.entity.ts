export class HistorialSalarioEntity {

    constructor(
        public readonly id: number,
        public readonly empleadoid: number,
        public readonly salarioanterior: number,
        public readonly salarionuevo: number,
        public readonly motivo?: string | null,
        public readonly fechacambio?: Date | null,
        public readonly empleadonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): HistorialSalarioEntity {
        const id = object.id ?? object.historialid;
        const { empleadoid, salarioanterior, salarionuevo, motivo, fechacambio } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (salarioanterior == null) throw 'Salario anterior es obligatorio';
        if (salarionuevo == null) throw 'Salario nuevo es obligatorio';

        const empleadonombre = object.empleados ? `${object.empleados.primernombre} ${object.empleados.primerapellido}` : (object.empleadonombre ?? null);

        return new HistorialSalarioEntity(
            Number(id),
            Number(empleadoid),
            Number(salarioanterior),
            Number(salarionuevo),
            motivo ?? null,
            fechacambio ? new Date(fechacambio) : null,
            empleadonombre
        );
    }
}
