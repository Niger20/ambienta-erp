export class PagoCuentaPorPagarEntity {

    constructor(
        public readonly pagoid: number,
        public readonly cuentapagarid: number,
    ) { }

    public static fromObject(object: { [key: string]: any }): PagoCuentaPorPagarEntity {
        const { pagoid, cuentapagarid } = object;

        if (pagoid == null) throw 'Pago ID es obligatorio';
        if (cuentapagarid == null) throw 'Cuenta por Pagar ID es obligatorio';

        return new PagoCuentaPorPagarEntity(
            Number(pagoid),
            Number(cuentapagarid),
        );
    }
}
