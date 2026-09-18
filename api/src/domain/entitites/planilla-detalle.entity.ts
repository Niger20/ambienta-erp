export class PlanillaDetalleEntity {

    constructor(
        public readonly id: number,
        public readonly periodoid: number,
        public readonly empleadoid: number,
        public readonly salariobruto: number = 0,
        public readonly montohorasextra: number = 0,
        public readonly comisiones: number = 0,
        public readonly pagoferiados: number = 0,
        public readonly otrosingresos: number = 0,
        public readonly totalingresos?: number | null,
        public readonly insslaboral: number = 0,
        public readonly ir: number = 0,
        public readonly otrasdeducciones: number = 0,
        public readonly cuotasprestamos: number = 0,
        public readonly anticipos: number = 0,
        public readonly totaldeducciones?: number | null,
        public readonly salarioneto?: number | null,
        public readonly insspatronal: number = 0,
        public readonly estado: string = 'BORRADOR',
        public readonly observaciones?: string | null,
        public readonly empleadonombre?: string | null,
        public readonly periodonombre?: string | null,
        public readonly horasextra?: any[],
        public readonly deducciones?: any[],
        public readonly cuotasprestamos_rel?: any[],
    ) {}

    public static fromObject(object: { [key: string]: any }): PlanillaDetalleEntity {
        const id = object.id ?? object.detalleid ?? object.planilladetalleid;
        const salariobruto = object.salariobruto ?? object.salariobase ?? 0;
        const montohorasextra = object.montohorasextra ?? object.montoextra ?? 0;
        const ir = object.ir ?? object.irlaboral ?? 0;
        const cuotasprestamos = object.cuotasprestamos ?? object.deduccionesprestamos ?? 0;
        const anticipos = object.anticipos ?? object.deduccionesanticipos ?? 0;
        const {
            periodoid,
            empleadoid,
            comisiones,
            pagoferiados,
            otrosingresos,
            totalingresos,
            insslaboral,
            otrasdeducciones,
            totaldeducciones,
            salarioneto,
            insspatronal,
            estado,
            observaciones,
            planillahorasextra,
            planilladeducciones,
            cuotasprestamos_rel
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (periodoid == null) throw 'Período ID es obligatorio';
        if (empleadoid == null) throw 'Empleado ID es obligatorio';

        const empleadonombre = object.empleados ? `${object.empleados.nombre} ${object.empleados.apellidos}` : (object.empleadonombre ?? null);
        const periodonombre = object.periodosplanilla?.tipoperiodo ?? object.periodonombre ?? null;

        return new PlanillaDetalleEntity(
            Number(id),
            Number(periodoid),
            Number(empleadoid),
            Number(salariobruto),
            Number(montohorasextra),
            comisiones != null ? Number(comisiones) : 0,
            pagoferiados != null ? Number(pagoferiados) : 0,
            otrosingresos != null ? Number(otrosingresos) : 0,
            totalingresos != null ? Number(totalingresos) : null,
            insslaboral != null ? Number(insslaboral) : 0,
            Number(ir),
            otrasdeducciones != null ? Number(otrasdeducciones) : 0,
            Number(cuotasprestamos),
            Number(anticipos),
            totaldeducciones != null ? Number(totaldeducciones) : null,
            salarioneto != null ? Number(salarioneto) : null,
            insspatronal != null ? Number(insspatronal) : 0,
            estado || 'BORRADOR',
            observaciones ?? null,
            empleadonombre,
            periodonombre,
            planillahorasextra,
            planilladeducciones,
            cuotasprestamos_rel
        );
    }
}
