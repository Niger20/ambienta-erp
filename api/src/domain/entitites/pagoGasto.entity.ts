export class PagoGastoEntity {

    constructor(
        public readonly pagoid: number,
        public readonly gastoid: number,
        public readonly pago?: any,   // joined pago data (monto, fecha, metodopago, etc.)
    ) { }

    public static fromObject(object: { [key: string]: any }): PagoGastoEntity {
        const { pagoid, gastoid, pagos } = object;

        if (pagoid == null) throw 'Pago ID es obligatorio';
        if (gastoid == null) throw 'Gasto ID es obligatorio';

        return new PagoGastoEntity(
            Number(pagoid),
            Number(gastoid),
            pagos ?? undefined,  // pass through pagos relation if present
        );
    }
}
