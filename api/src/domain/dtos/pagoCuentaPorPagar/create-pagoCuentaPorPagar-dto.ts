export class CreatePagoCuentaPorPagarDto {

    private constructor(
        public readonly pagoid: number,
        public readonly cuentapagarid: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreatePagoCuentaPorPagarDto?] {
        const { pagoid, cuentapagarid } = props;

        if (pagoid == null) return ['El pago id es obligatorio', undefined];
        const parsedPagoId = Number(pagoid);
        if (Number.isNaN(parsedPagoId) || !Number.isInteger(parsedPagoId)) {
            return ['El pago id debe ser un numero entero valido', undefined];
        }

        if (cuentapagarid == null) return ['El cuenta por pagar id es obligatorio', undefined];
        const parsedCuentaPagarId = Number(cuentapagarid);
        if (Number.isNaN(parsedCuentaPagarId) || !Number.isInteger(parsedCuentaPagarId)) {
            return ['El cuenta por pagar id debe ser un numero entero valido', undefined];
        }

        return [undefined, new CreatePagoCuentaPorPagarDto(
            parsedPagoId,
            parsedCuentaPagarId,
        )];
    }
}
