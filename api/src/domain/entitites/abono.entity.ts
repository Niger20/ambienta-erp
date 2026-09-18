export class AbonoEntity {

    constructor(
        public readonly id: number,
        public readonly cuentaid: number,
        public readonly monto: number,
        public readonly metodopago: string,
        public readonly fecha?: Date | null,
    ) { }

    public static fromObject(object: { [key: string]: any }): AbonoEntity {
        const id = object.id ?? object.abonoid;
        const {
            cuentaid,
            fecha,
            monto,
        } = object;
        const metodopago = object.metodopago || 'EFECTIVO';

        if (id == null) throw 'ID es obligatorio';
        if (cuentaid == null) throw 'Cuenta ID es obligatorio';
        if (monto == null) throw 'Monto es obligatorio';

        return new AbonoEntity(
            Number(id),
            Number(cuentaid),
            Number(monto),
            metodopago,
            fecha ? new Date(fecha) : null,
        );
    }
}
