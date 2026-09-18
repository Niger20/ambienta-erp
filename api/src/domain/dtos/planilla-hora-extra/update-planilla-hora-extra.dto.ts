export class UpdatePlanillaHoraExtraDto {

    private constructor(
        public readonly id: number,
        public readonly detalleid?: number,
        public readonly fecha?: Date,
        public readonly tipohora?: string,
        public readonly horastrabajadas?: number,
        public readonly tarifahora?: number,
        public readonly porcentajerecargo?: number,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.detalleid != null) returnObj.detalleid = this.detalleid;
        if (this.fecha !== undefined) returnObj.fecha = this.fecha;
        if (this.tipohora != null) returnObj.tipohora = this.tipohora;
        if (this.horastrabajadas != null) returnObj.horastrabajadas = this.horastrabajadas;
        if (this.tarifahora != null) returnObj.tarifahora = this.tarifahora;
        if (this.porcentajerecargo != null) returnObj.porcentajerecargo = this.porcentajerecargo;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdatePlanillaHoraExtraDto?] {
        const { id, fecha, tipohora } = props;
        const detalleid = props.detalleid ?? props.planilladetalleid;
        const horastrabajadas = props.horastrabajadas ?? props.numerohoras;
        const tarifahora = props.tarifahora ?? props.montopagar;
        const porcentajerecargo = props.porcentajerecargo ?? (props.factor ? Number(props.factor) * 100 : undefined);

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedDetalleId: number | undefined;
        if (detalleid != null) {
            const parsed = Number(detalleid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El detalle de planilla ID debe ser un número entero válido', undefined];
            }
            parsedDetalleId = parsed;
        }

        let parsedFecha: Date | undefined;
        if (fecha !== undefined) {
            const d = new Date(fecha);
            if (isNaN(d.getTime())) return ['La fecha es inválida', undefined];
            parsedFecha = d;
        }

        return [
            undefined,
            new UpdatePlanillaHoraExtraDto(
                parsedId,
                parsedDetalleId,
                parsedFecha,
                tipohora ? String(tipohora).trim().toUpperCase() : undefined,
                horastrabajadas != null ? Number(horastrabajadas) : undefined,
                tarifahora != null ? Number(tarifahora) : undefined,
                porcentajerecargo != null ? Number(porcentajerecargo) : undefined
            )
        ];
    }
}
