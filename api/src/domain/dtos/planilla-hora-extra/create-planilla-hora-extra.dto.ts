export class CreatePlanillaHoraExtraDto {

    private constructor(
        public readonly detalleid: number,
        public readonly fecha: Date,
        public readonly tipohora: string,
        public readonly horastrabajadas: number,
        public readonly tarifahora: number,
        public readonly porcentajerecargo: number,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreatePlanillaHoraExtraDto?] {
        const detalleid = props.detalleid ?? props.planilladetalleid;
        const horastrabajadas = props.horastrabajadas ?? props.numerohoras;
        const tarifahora = props.tarifahora ?? props.montopagar;
        const porcentajerecargo = props.porcentajerecargo ?? (props.factor ? Number(props.factor) * 100 : 200);
        const { fecha, tipohora } = props;

        if (detalleid == null) return ['El detalle de planilla ID es obligatorio', undefined];
        const parsedDetalleId = Number(detalleid);
        if (Number.isNaN(parsedDetalleId) || !Number.isInteger(parsedDetalleId)) {
            return ['El detalle de planilla ID debe ser un número entero válido', undefined];
        }

        if (!fecha) return ['La fecha es obligatoria', undefined];
        const parsedFecha = new Date(fecha);
        if (isNaN(parsedFecha.getTime())) return ['La fecha es inválida', undefined];

        if (horastrabajadas == null) return ['Las horas trabajadas son obligatorias', undefined];
        const parsedHoras = Number(horastrabajadas);
        if (Number.isNaN(parsedHoras) || parsedHoras <= 0) return ['Las horas trabajadas deben ser mayores a cero', undefined];

        if (tarifahora == null) return ['La tarifa por hora es obligatoria', undefined];
        const parsedTarifa = Number(tarifahora);
        if (Number.isNaN(parsedTarifa) || parsedTarifa <= 0) return ['La tarifa por hora debe ser mayor a cero', undefined];

        const parsedRecargo = Number(porcentajerecargo) || 200;

        return [
            undefined,
            new CreatePlanillaHoraExtraDto(
                parsedDetalleId,
                parsedFecha,
                tipohora ? String(tipohora).trim().toUpperCase() : 'EXTRA_DIURNA',
                parsedHoras,
                parsedTarifa,
                parsedRecargo
            )
        ];
    }
}
