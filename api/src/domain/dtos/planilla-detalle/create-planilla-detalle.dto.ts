export class CreatePlanillaDetalleDto {

    private constructor(
        public readonly periodoid: number,
        public readonly empleadoid: number,
        public readonly salariobruto: number,
        public readonly montohorasextra: number = 0,
        public readonly comisiones: number = 0,
        public readonly pagoferiados: number = 0,
        public readonly otrosingresos: number = 0,
        public readonly insslaboral: number = 0,
        public readonly ir: number = 0,
        public readonly otrasdeducciones: number = 0,
        public readonly cuotasprestamos: number = 0,
        public readonly anticipos: number = 0,
        public readonly insspatronal: number = 0,
        public readonly estado: string = 'BORRADOR',
        public readonly observaciones?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreatePlanillaDetalleDto?] {
        const {
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
        const montohorasextra = props.montohorasextra ?? props.montoextra ?? 0;
        const ir = props.ir ?? props.irlaboral ?? 0;
        const cuotasprestamos = props.cuotasprestamos ?? props.deduccionesprestamos ?? 0;
        const anticipos = props.anticipos ?? props.deduccionesanticipos ?? 0;

        if (periodoid == null) return ['El período ID es obligatorio', undefined];
        const parsedPeriodoId = Number(periodoid);
        if (Number.isNaN(parsedPeriodoId) || !Number.isInteger(parsedPeriodoId)) {
            return ['El período ID debe ser un número entero válido', undefined];
        }

        if (empleadoid == null) return ['El empleado ID es obligatorio', undefined];
        const parsedEmpleadoId = Number(empleadoid);
        if (Number.isNaN(parsedEmpleadoId) || !Number.isInteger(parsedEmpleadoId)) {
            return ['El empleado ID debe ser un número entero válido', undefined];
        }

        if (salariobruto == null) return ['El salario bruto es obligatorio', undefined];
        const parsedSalarioBruto = Number(salariobruto);
        if (Number.isNaN(parsedSalarioBruto) || parsedSalarioBruto < 0) {
            return ['El salario bruto debe ser un número válido', undefined];
        }

        const parsedExtra = Number(montohorasextra) || 0;
        const parsedComis = Number(comisiones) || 0;
        const parsedFeriados = Number(pagoferiados) || 0;
        const parsedOtros = Number(otrosingresos) || 0;
        const totalIngresos = parsedSalarioBruto + parsedExtra + parsedComis + parsedFeriados + parsedOtros;

        const parsedInssLab = insslaboral != null ? Number(insslaboral) : (totalIngresos * 0.07);
        const parsedIr = Number(ir) || 0;
        const parsedOtras = Number(otrasdeducciones) || 0;
        const parsedPrestamos = Number(cuotasprestamos) || 0;
        const parsedAnticipos = Number(anticipos) || 0;
        const parsedInssPat = insspatronal != null ? Number(insspatronal) : (totalIngresos * 0.225);

        return [
            undefined,
            new CreatePlanillaDetalleDto(
                parsedPeriodoId,
                parsedEmpleadoId,
                parsedSalarioBruto,
                parsedExtra,
                parsedComis,
                parsedFeriados,
                parsedOtros,
                parsedInssLab,
                parsedIr,
                parsedOtras,
                parsedPrestamos,
                parsedAnticipos,
                parsedInssPat,
                estado ? String(estado).trim().toUpperCase() : 'BORRADOR',
                observaciones ? String(observaciones).trim() : null
            )
        ];
    }
}
