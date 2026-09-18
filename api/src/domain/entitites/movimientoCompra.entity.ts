export class MovimientoCompraEntity {

    constructor(
        public readonly movimientocompraid: number,
        public readonly compraid: number,
    ) { }

    public static fromObject(object: { [key: string]: any }): MovimientoCompraEntity {
        const { movimientocompraid, compraid } = object;

        if (movimientocompraid == null) throw 'Movimiento Compra ID es obligatorio';
        if (compraid == null) throw 'Compra ID es obligatorio';

        return new MovimientoCompraEntity(
            Number(movimientocompraid),
            Number(compraid),
        );
    }
}
