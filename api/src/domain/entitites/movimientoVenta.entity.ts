export class MovimientoVentaEntity {

    constructor(
        public readonly movimeintoventaid: number,
        public readonly ventaid: number,
    ) { }

    public static fromObject(object: { [key: string]: any }): MovimientoVentaEntity {
        const { movimeintoventaid, ventaid } = object;

        if (movimeintoventaid == null) throw 'Movimiento Venta ID es obligatorio';
        if (ventaid == null) throw 'Venta ID es obligatorio';

        return new MovimientoVentaEntity(
            Number(movimeintoventaid),
            Number(ventaid),
        );
    }
}
