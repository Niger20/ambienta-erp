export class CreateHistorialSalarioDto {

    private constructor(
        public readonly empleadoid: number,
        public readonly salarioanterior: number,
        public readonly salarionuevo: number,
        public readonly motivo?: string | null,
        public readonly fechacambio?: Date | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateHistorialSalarioDto?] {
        const { empleadoid, salarioanterior, salarionuevo, motivo, fechacambio } = props;

        if (empleadoid == null) return ['El empleado ID es obligatorio', undefined];
        const parsedEmpleadoId = Number(empleadoid);
        if (Number.isNaN(parsedEmpleadoId) || !Number.isInteger(parsedEmpleadoId)) {
            return ['El empleado ID debe ser un número entero válido', undefined];
        }

        if (salarioanterior == null) return ['El salario anterior es obligatorio', undefined];
        const parsedAnterior = Number(salarioanterior);
        if (Number.isNaN(parsedAnterior) || parsedAnterior < 0) {
            return ['El salario anterior debe ser un número válido', undefined];
        }

        if (salarionuevo == null) return ['El salario nuevo es obligatorio', undefined];
        const parsedNuevo = Number(salarionuevo);
        if (Number.isNaN(parsedNuevo) || parsedNuevo < 0) {
            return ['El salario nuevo debe ser un número válido', undefined];
        }

        let parsedFecha: Date | null = new Date();
        if (fechacambio != null) {
            const d = new Date(fechacambio);
            if (isNaN(d.getTime())) return ['La fecha de cambio es inválida', undefined];
            parsedFecha = d;
        }

        return [
            undefined,
            new CreateHistorialSalarioDto(
                parsedEmpleadoId,
                parsedAnterior,
                parsedNuevo,
                motivo ? String(motivo).trim() : null,
                parsedFecha
            )
        ];
    }
}
