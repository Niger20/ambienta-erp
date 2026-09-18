export class AcumuladoVacacionesEntity {

    constructor(
        public readonly id: number,
        public readonly empleadoid: number,
        public readonly periodoid: number,
        public readonly diasganados: number,
        public readonly valordiasalario: number,
        public readonly montoganado: number,
        public readonly diasdisfrutados: number = 0,
        public readonly montopagado: number = 0,
        public readonly fechageneracion?: Date | null,
        public readonly empleadonombre?: string | null,
        public readonly periodonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): AcumuladoVacacionesEntity {
        const id = object.id ?? object.acumuladovacid ?? object.acumuladoid;
        const valordiasalario = object.valordiasalario ?? object.salariobruto ?? 0;
        const montoganado = object.montoganado ?? object.montoacumulado ?? 0;
        const diasdisfrutados = object.diasdisfrutados ?? object.diasgozados ?? 0;
        const {
            empleadoid,
            periodoid,
            diasganados,
            montopagado,
            fechageneracion
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';
        if (periodoid == null) throw 'Período ID es obligatorio';
        if (diasganados == null) throw 'Días ganados es obligatorio';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);
        const periodonombre = object.periodosplanilla?.tipoperiodo ?? object.periodonombre ?? null;

        return new AcumuladoVacacionesEntity(
            Number(id),
            Number(empleadoid),
            Number(periodoid),
            Number(diasganados),
            Number(valordiasalario),
            Number(montoganado),
            Number(diasdisfrutados),
            montopagado != null ? Number(montopagado) : 0,
            fechageneracion ? new Date(fechageneracion) : null,
            empleadonombre,
            periodonombre
        );
    }
}
