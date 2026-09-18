export class UpdatePlanillaDeduccionDto {

    private constructor(
        public readonly id: number,
        public readonly detalleid?: number,
        public readonly concepto?: string,
        public readonly monto?: number,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.detalleid != null) returnObj.detalleid = this.detalleid;
        if (this.concepto != null) returnObj.concepto = this.concepto;
        if (this.monto != null) returnObj.monto = this.monto;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdatePlanillaDeduccionDto?] {
        const { id, monto } = props;
        const detalleid = props.detalleid ?? props.planilladetalleid;
        const concepto = props.concepto ?? props.descripcion;

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

        let parsedMonto: number | undefined;
        if (monto != null) {
            const parsed = Number(monto);
            if (Number.isNaN(parsed) || parsed <= 0) return ['El monto debe ser mayor a cero', undefined];
            parsedMonto = parsed;
        }

        return [
            undefined,
            new UpdatePlanillaDeduccionDto(
                parsedId,
                parsedDetalleId,
                concepto ? String(concepto).trim() : undefined,
                parsedMonto
            )
        ];
    }
}
