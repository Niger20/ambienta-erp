export class CreatePlanillaDeduccionDto {

    private constructor(
        public readonly detalleid: number,
        public readonly concepto: string,
        public readonly monto: number,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreatePlanillaDeduccionDto?] {
        const detalleid = props.detalleid ?? props.planilladetalleid;
        const concepto = props.concepto ?? props.descripcion;
        const { monto } = props;

        if (detalleid == null) return ['El detalle de planilla ID es obligatorio', undefined];
        const parsedDetalleId = Number(detalleid);
        if (Number.isNaN(parsedDetalleId) || !Number.isInteger(parsedDetalleId)) {
            return ['El detalle de planilla ID debe ser un número entero válido', undefined];
        }

        if (!concepto || typeof concepto !== 'string') return ['El concepto de la deducción es obligatorio', undefined];

        if (monto == null) return ['El monto es obligatorio', undefined];
        const parsedMonto = Number(monto);
        if (Number.isNaN(parsedMonto) || parsedMonto <= 0) return ['El monto debe ser mayor a cero', undefined];

        return [
            undefined,
            new CreatePlanillaDeduccionDto(
                parsedDetalleId,
                concepto.trim(),
                parsedMonto
            )
        ];
    }
}
