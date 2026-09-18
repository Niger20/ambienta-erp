export class CreateCostoAdicionalCompraDto {

    private constructor(
        public readonly compraid: number,
        public readonly concepto: string,
        public readonly monto: number,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateCostoAdicionalCompraDto?] {
        const { compraid, concepto, monto } = props;

        if (compraid == null) return ['La compra ID es obligatoria', undefined];
        const parsedCompraId = Number(compraid);
        if (Number.isNaN(parsedCompraId) || !Number.isInteger(parsedCompraId)) {
            return ['La compra ID debe ser un número entero válido', undefined];
        }

        if (!concepto) return ['El concepto es obligatorio', undefined];
        if (typeof concepto !== 'string') return ['El concepto debe ser una cadena de texto', undefined];

        if (monto == null) return ['El monto es obligatorio', undefined];
        const parsedMonto = Number(monto);
        if (Number.isNaN(parsedMonto) || parsedMonto < 0) {
            return ['El monto debe ser un número positivo válido', undefined];
        }

        return [
            undefined,
            new CreateCostoAdicionalCompraDto(
                parsedCompraId,
                concepto.trim(),
                parsedMonto
            )
        ];
    }
}
