export class MovimientoInventarioEntity {

    constructor(
        public readonly id: number,
        public readonly productoid: number,
        public readonly tipomovimiento: string,
        public readonly cantidad: number,
        public readonly stockanterior: number,
        public readonly stockresultante: number,
        public readonly motivo?: string | null,
        public readonly fecha?: Date | null,
        public readonly productonombre?: string | null,
        public readonly ventaid?: number | null,
        public readonly compraid?: number | null,
    ) { }

    public static fromObject(object: { [key: string]: any }): MovimientoInventarioEntity {
        const id = object.id ?? object.movimientoid;
        const { productoid, tipomovimiento, cantidad, stockanterior, stockresultante, motivo, fecha } = object;

        const productonombre =
            object.productonombre ??
            object.productos?.nombre ??
            object.producto?.nombre ??
            null;

        const ventaid = object.ventaid ?? object.movimientoventas?.[0]?.ventaid ?? null;
        const compraid = object.compraid ?? object.movimientoscompras?.[0]?.compraid ?? null;

        if (id == null) throw 'ID es obligatorio';
        if (productoid == null) throw 'Producto ID es obligatorio';
        if (!tipomovimiento) throw 'Tipo de movimiento es obligatorio';
        if (cantidad == null) throw 'Cantidad es obligatorio';
        if (stockanterior == null) throw 'Stock anterior es obligatorio';

        return new MovimientoInventarioEntity(
            Number(id),
            Number(productoid),
            tipomovimiento,
            Number(cantidad),
            Number(stockanterior),
            Number(stockresultante ?? 0),
            motivo ?? null,
            fecha ? new Date(fecha) : null,
            productonombre,
            ventaid ? Number(ventaid) : null,
            compraid ? Number(compraid) : null,
        );
    }
}
