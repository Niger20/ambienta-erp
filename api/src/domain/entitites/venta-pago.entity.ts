export class VentaPagoEntity {

    constructor(
        public readonly id: number,
        public readonly ventaid: number,
        public readonly metodopago: string,
        public readonly monto: number,
        public readonly banco?: string | null,
        public readonly numerotransferencia?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): VentaPagoEntity {
        const id = object.id ?? object.ventapagoid;
        const { ventaid, metodopago, monto, banco, numerotransferencia } = object;

        if (id == null) throw 'ID es obligatorio';
        if (ventaid == null) throw 'Venta ID es obligatoria';
        if (!metodopago) throw 'Método de pago es obligatorio';
        if (monto == null) throw 'Monto es obligatorio';

        return new VentaPagoEntity(
            Number(id),
            Number(ventaid),
            metodopago,
            Number(monto),
            banco ?? null,
            numerotransferencia ?? null
        );
    }
}
