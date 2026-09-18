export class CostoAdicionalCompraEntity {

    constructor(
        public readonly id: number,
        public readonly compraid: number,
        public readonly concepto: string,
        public readonly monto: number,
    ) {}

    public static fromObject(object: { [key: string]: any }): CostoAdicionalCompraEntity {
        const id = object.id ?? object.costoadicionalid;
        const { compraid, concepto, monto } = object;

        if (id == null) throw 'ID es obligatorio';
        if (compraid == null) throw 'Compra ID es obligatorio';
        if (!concepto) throw 'El concepto es obligatorio';
        if (monto == null) throw 'El monto es obligatorio';

        const montoNumber = Number(monto);
        if (isNaN(montoNumber)) throw 'El monto debe ser un número válido';

        return new CostoAdicionalCompraEntity(
            Number(id),
            Number(compraid),
            concepto,
            montoNumber
        );
    }
}
