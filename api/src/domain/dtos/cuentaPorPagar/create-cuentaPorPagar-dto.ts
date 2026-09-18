export class CreateCuentaPorPagarDto {

    private constructor(
        public readonly compraid: number,
        public readonly fechavencimiento: Date,
        public readonly estado: string,
        public readonly cuotas?: number,
        public readonly fechacuota?: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateCuentaPorPagarDto?] {
        const { compraid, fechavencimiento, estado, cuotas, fechacuota } = props;

        if (compraid == null) return ['El compra id es obligatorio', undefined];
        const parsedCompraId = Number(compraid);
        if (Number.isNaN(parsedCompraId) || !Number.isInteger(parsedCompraId)) {
            return ['El compra id debe ser un numero entero valido', undefined];
        }

        if (!fechavencimiento) return ['La fecha de vencimiento es obligatoria', undefined];
        const parsedFechaVencimiento = new Date(fechavencimiento);
        if (parsedFechaVencimiento.toString() === 'Invalid Date') {
            return ['La fecha de vencimiento debe ser una fecha valida', undefined];
        }

        if (!estado) return ['El estado es obligatorio', undefined];
        if (typeof estado !== 'string') return ['El estado debe ser una cadena de texto', undefined];

        let parsedCuotas: number | undefined;
        if (cuotas != null) {
            const num = Number(cuotas);
            if (Number.isNaN(num) || !Number.isInteger(num)) {
                return ['Las cuotas deben ser un numero entero valido', undefined];
            }
            parsedCuotas = num;
        }

        let parsedFechaCuota: number | undefined;
        if (fechacuota != null) {
            const num = Number(fechacuota);
            if (Number.isNaN(num) || !Number.isInteger(num)) {
                return ['La fecha cuota debe ser un numero entero valido', undefined];
            }
            parsedFechaCuota = num;
        }

        return [undefined, new CreateCuentaPorPagarDto(
            parsedCompraId,
            parsedFechaVencimiento,
            estado,
            parsedCuotas,
            parsedFechaCuota,
        )];
    }
}
