export class CreatePeriodoPlanillaDto {

    private constructor(
        public readonly fechainicio: Date,
        public readonly fechafin: Date,
        public readonly tipoperiodo: string = 'MENSUAL',
        public readonly fechapago?: Date | null,
        public readonly estado: string = 'ABIERTO',
        public readonly observaciones?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreatePeriodoPlanillaDto?] {
        const tipoperiodo = props.tipoperiodo ?? props.nombre ?? 'MENSUAL';
        const { fechainicio, fechafin, fechapago, estado, observaciones } = props;

        if (!fechainicio) return ['La fecha de inicio es obligatoria', undefined];
        const parsedInicio = new Date(fechainicio);
        if (isNaN(parsedInicio.getTime())) return ['La fecha de inicio es inválida', undefined];

        if (!fechafin) return ['La fecha de fin es obligatoria', undefined];
        const parsedFin = new Date(fechafin);
        if (isNaN(parsedFin.getTime())) return ['La fecha de fin es inválida', undefined];

        if (parsedFin < parsedInicio) return ['La fecha de fin no puede ser anterior a la de inicio', undefined];

        let parsedPago: Date | null = null;
        if (fechapago) {
            const d = new Date(fechapago);
            if (!isNaN(d.getTime())) parsedPago = d;
        }

        return [
            undefined,
            new CreatePeriodoPlanillaDto(
                parsedInicio,
                parsedFin,
                String(tipoperiodo).trim().toUpperCase(),
                parsedPago,
                estado ? String(estado).trim().toUpperCase() : 'ABIERTO',
                observaciones ? String(observaciones).trim() : null
            )
        ];
    }
}
