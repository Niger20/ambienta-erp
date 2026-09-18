export class CreatePagoGastoDto {

    private constructor(
        public readonly pagoid: number,
        public readonly gastoid: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreatePagoGastoDto?] {
        const { pagoid, gastoid } = props;

        if (pagoid == null) return ['El pago id es obligatorio', undefined];
        const parsedPagoId = Number(pagoid);
        if (Number.isNaN(parsedPagoId) || !Number.isInteger(parsedPagoId)) {
            return ['El pago id debe ser un numero entero valido', undefined];
        }

        if (gastoid == null) return ['El gasto id es obligatorio', undefined];
        const parsedGastoId = Number(gastoid);
        if (Number.isNaN(parsedGastoId) || !Number.isInteger(parsedGastoId)) {
            return ['El gasto id debe ser un numero entero valido', undefined];
        }

        return [undefined, new CreatePagoGastoDto(
            parsedPagoId,
            parsedGastoId,
        )];
    }
}
