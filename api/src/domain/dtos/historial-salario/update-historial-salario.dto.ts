export class UpdateHistorialSalarioDto {

    private constructor(
        public readonly id: number,
        public readonly empleadoid?: number,
        public readonly salarioanterior?: number,
        public readonly salarionuevo?: number,
        public readonly motivo?: string | null,
        public readonly fechacambio?: Date | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.salarioanterior != null) returnObj.salarioanterior = this.salarioanterior;
        if (this.salarionuevo != null) returnObj.salarionuevo = this.salarionuevo;
        if (this.motivo !== undefined) returnObj.motivo = this.motivo;
        if (this.fechacambio !== undefined) returnObj.fechacambio = this.fechacambio;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateHistorialSalarioDto?] {
        const { id, empleadoid, salarioanterior, salarionuevo, motivo, fechacambio } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedEmpleadoId: number | undefined;
        if (empleadoid != null) {
            const parsed = Number(empleadoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El empleado ID debe ser un número entero válido', undefined];
            }
            parsedEmpleadoId = parsed;
        }

        let parsedAnterior: number | undefined;
        if (salarioanterior != null) {
            const parsed = Number(salarioanterior);
            if (Number.isNaN(parsed) || parsed < 0) {
                return ['El salario anterior debe ser un número válido', undefined];
            }
            parsedAnterior = parsed;
        }

        let parsedNuevo: number | undefined;
        if (salarionuevo != null) {
            const parsed = Number(salarionuevo);
            if (Number.isNaN(parsed) || parsed < 0) {
                return ['El salario nuevo debe ser un número válido', undefined];
            }
            parsedNuevo = parsed;
        }

        let parsedFecha: Date | null | undefined;
        if (fechacambio !== undefined) {
            if (fechacambio === null) {
                parsedFecha = null;
            } else {
                const d = new Date(fechacambio);
                if (isNaN(d.getTime())) return ['La fecha de cambio es inválida', undefined];
                parsedFecha = d;
            }
        }

        return [
            undefined,
            new UpdateHistorialSalarioDto(
                parsedId,
                parsedEmpleadoId,
                parsedAnterior,
                parsedNuevo,
                motivo !== undefined ? (motivo ? String(motivo).trim() : null) : undefined,
                parsedFecha
            )
        ];
    }
}
