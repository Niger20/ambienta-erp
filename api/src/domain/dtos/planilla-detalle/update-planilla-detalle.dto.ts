export class UpdatePlanillaDetalleDto {

    private constructor(
        public readonly id: number,
        public readonly periodoid?: number,
        public readonly empleadoid?: number,
        public readonly salariobruto?: number,
        public readonly montohorasextra?: number,
        public readonly comisiones?: number,
        public readonly pagoferiados?: number,
        public readonly otrosingresos?: number,
        public readonly insslaboral?: number,
        public readonly ir?: number,
        public readonly otrasdeducciones?: number,
        public readonly cuotasprestamos?: number,
        public readonly anticipos?: number,
        public readonly insspatronal?: number,
        public readonly estado?: string,
        public readonly observaciones?: string | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.periodoid != null) returnObj.periodoid = this.periodoid;
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.salariobruto != null) returnObj.salariobruto = this.salariobruto;
        if (this.montohorasextra != null) returnObj.montohorasextra = this.montohorasextra;
        if (this.comisiones != null) returnObj.comisiones = this.comisiones;
        if (this.pagoferiados != null) returnObj.pagoferiados = this.pagoferiados;
        if (this.otrosingresos != null) returnObj.otrosingresos = this.otrosingresos;
        if (this.insslaboral != null) returnObj.insslaboral = this.insslaboral;
        if (this.ir != null) returnObj.ir = this.ir;
        if (this.otrasdeducciones != null) returnObj.otrasdeducciones = this.otrasdeducciones;
        if (this.cuotasprestamos != null) returnObj.cuotasprestamos = this.cuotasprestamos;
        if (this.anticipos != null) returnObj.anticipos = this.anticipos;
        if (this.insspatronal != null) returnObj.insspatronal = this.insspatronal;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.observaciones !== undefined) returnObj.observaciones = this.observaciones;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdatePlanillaDetalleDto?] {
        const {
            id,
            periodoid,
            empleadoid,
            comisiones,
            pagoferiados,
            otrosingresos,
            insslaboral,
            otrasdeducciones,
            insspatronal,
            estado,
            observaciones
        } = props;
        const salariobruto = props.salariobruto ?? props.salariobase;
        const montohorasextra = props.montohorasextra ?? props.montoextra;
        const ir = props.ir ?? props.irlaboral;
        const cuotasprestamos = props.cuotasprestamos ?? props.deduccionesprestamos;
        const anticipos = props.anticipos ?? props.deduccionesanticipos;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedPeriodoId: number | undefined;
        if (periodoid != null) {
            const parsed = Number(periodoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) return ['El período ID debe ser un entero válido', undefined];
            parsedPeriodoId = parsed;
        }

        let parsedEmpleadoId: number | undefined;
        if (empleadoid != null) {
            const parsed = Number(empleadoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) return ['El empleado ID debe ser un entero válido', undefined];
            parsedEmpleadoId = parsed;
        }

        return [
            undefined,
            new UpdatePlanillaDetalleDto(
                parsedId,
                parsedPeriodoId,
                parsedEmpleadoId,
                salariobruto != null ? Number(salariobruto) : undefined,
                montohorasextra != null ? Number(montohorasextra) : undefined,
                comisiones != null ? Number(comisiones) : undefined,
                pagoferiados != null ? Number(pagoferiados) : undefined,
                otrosingresos != null ? Number(otrosingresos) : undefined,
                insslaboral != null ? Number(insslaboral) : undefined,
                ir != null ? Number(ir) : undefined,
                otrasdeducciones != null ? Number(otrasdeducciones) : undefined,
                cuotasprestamos != null ? Number(cuotasprestamos) : undefined,
                anticipos != null ? Number(anticipos) : undefined,
                insspatronal != null ? Number(insspatronal) : undefined,
                estado ? String(estado).trim().toUpperCase() : undefined,
                observaciones !== undefined ? (observaciones ? String(observaciones).trim() : null) : undefined
            )
        ];
    }
}
