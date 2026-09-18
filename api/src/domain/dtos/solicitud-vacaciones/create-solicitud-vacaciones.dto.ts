export class CreateSolicitudVacacionesDto {

    private constructor(
        public readonly empleadoid: number,
        public readonly fechainicio: Date,
        public readonly fechafin: Date,
        public readonly diashabiles: number,
        public readonly estado: string = 'PENDIENTE',
        public readonly observaciones?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateSolicitudVacacionesDto?] {
        const {
            empleadoid,
            fechainicio,
            fechafin,
            diashabiles,
            dias,
            estado,
            observaciones
        } = props;

        if (empleadoid == null) return ['El empleado ID es obligatorio', undefined];
        const parsedEmpleadoId = Number(empleadoid);
        if (Number.isNaN(parsedEmpleadoId) || !Number.isInteger(parsedEmpleadoId)) {
            return ['El empleado ID debe ser un número entero válido', undefined];
        }

        if (!fechainicio) return ['La fecha de inicio es obligatoria', undefined];
        const parsedInicio = new Date(fechainicio);
        if (isNaN(parsedInicio.getTime())) return ['La fecha de inicio es inválida', undefined];

        if (!fechafin) return ['La fecha de fin es obligatoria', undefined];
        const parsedFin = new Date(fechafin);
        if (isNaN(parsedFin.getTime())) return ['La fecha de fin es inválida', undefined];

        if (parsedFin < parsedInicio) return ['La fecha de fin no puede ser anterior a la de inicio', undefined];

        const parsedDias = diashabiles != null ? Number(diashabiles) : (dias != null ? Number(dias) : Math.ceil((parsedFin.getTime() - parsedInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1);

        return [
            undefined,
            new CreateSolicitudVacacionesDto(
                parsedEmpleadoId,
                parsedInicio,
                parsedFin,
                parsedDias,
                estado ? String(estado).trim().toUpperCase() : 'PENDIENTE',
                observaciones ? String(observaciones).trim() : null
            )
        ];
    }
}
