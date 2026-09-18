export class CreateRegistroAsistenciaDto {

    private constructor(
        public readonly empleadoid: number,
        public readonly fecha: Date,
        public readonly horaentrada?: Date | null,
        public readonly horasalida?: Date | null,
        public readonly horastrabajadas?: number | null,
        public readonly horasextra: number = 0,
        public readonly tipoausencia?: string | null,
        public readonly observaciones?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateRegistroAsistenciaDto?] {
        const {
            empleadoid,
            fecha,
            horaentrada,
            horainicio,
            horasalida,
            horafin,
            horastrabajadas,
            horasextra,
            tipoausencia,
            observaciones
        } = props;

        if (empleadoid == null) return ['El empleado ID es obligatorio', undefined];
        const parsedEmpleadoId = Number(empleadoid);
        if (Number.isNaN(parsedEmpleadoId) || !Number.isInteger(parsedEmpleadoId)) {
            return ['El empleado ID debe ser un número entero válido', undefined];
        }

        if (!fecha) return ['La fecha es obligatoria', undefined];
        const parsedFecha = new Date(fecha);
        if (isNaN(parsedFecha.getTime())) return ['La fecha es inválida', undefined];

        let parsedEntrada: Date | null = null;
        const inputEntrada = horaentrada ?? horainicio;
        if (inputEntrada) {
            const d = new Date(inputEntrada);
            if (!isNaN(d.getTime())) parsedEntrada = d;
        }

        let parsedSalida: Date | null = null;
        const inputSalida = horasalida ?? horafin;
        if (inputSalida) {
            const d = new Date(inputSalida);
            if (!isNaN(d.getTime())) parsedSalida = d;
        }

        return [
            undefined,
            new CreateRegistroAsistenciaDto(
                parsedEmpleadoId,
                parsedFecha,
                parsedEntrada,
                parsedSalida,
                horastrabajadas != null ? Number(horastrabajadas) : null,
                horasextra != null ? Number(horasextra) : 0,
                tipoausencia ? String(tipoausencia).trim() : null,
                observaciones ? String(observaciones).trim() : null
            )
        ];
    }
}
